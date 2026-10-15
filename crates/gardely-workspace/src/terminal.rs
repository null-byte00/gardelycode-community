//! Interactive terminals over ConPTY (portable-pty). Output is read on a
//! dedicated thread and coalesced into ~16 ms chunks for the UI.

use std::collections::HashMap;
use std::io::{Read, Write};
use std::path::Path;
use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use anyhow::{Context, anyhow};
use portable_pty::{Child, CommandBuilder, MasterPty, PtySize, native_pty_system};

struct Term {
    master: Box<dyn MasterPty + Send>,
    writer: Box<dyn Write + Send>,
    child: Box<dyn Child + Send + Sync>,
}

#[derive(Default)]
pub struct Terminals {
    next: AtomicU32,
    terms: Mutex<HashMap<u32, Term>>,
}

fn default_shell() -> CommandBuilder {
    #[cfg(windows)]
    {
        let pwsh = which_exe("pwsh.exe");
        let mut c = CommandBuilder::new(pwsh.unwrap_or_else(|| "powershell.exe".into()));
        c.arg("-NoLogo");
        c
    }
    #[cfg(not(windows))]
    {
        CommandBuilder::new(std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".into()))
    }
}

#[cfg(windows)]
fn which_exe(name: &str) -> Option<String> {
    std::env::var_os("PATH")?
        .to_string_lossy()
        .split(';')
        .map(|d| Path::new(d).join(name))
        .find(|p| p.is_file())
        .map(|p| p.to_string_lossy().to_string())
}

impl Terminals {
    /// Spawn a shell in `cwd`. `on_data` receives raw output bytes; `on_exit` fires once.
    pub fn spawn(
        &self,
        cwd: &Path,
        cols: u16,
        rows: u16,
        on_data: impl Fn(Vec<u8>) + Send + 'static,
        on_exit: impl FnOnce() + Send + 'static,
    ) -> anyhow::Result<u32> {
        let pair = native_pty_system()
            .openpty(PtySize { rows: rows.max(2), cols: cols.max(10), pixel_width: 0, pixel_height: 0 })
            .context("could not open a terminal")?;
        let mut cmd = default_shell();
        cmd.cwd(cwd);
        cmd.env("TERM", "xterm-256color");
        let child = pair.slave.spawn_command(cmd).context("could not start the shell")?;
        drop(pair.slave);

        let mut reader = pair.master.try_clone_reader()?;
        let writer = pair.master.take_writer()?;
        let id = self.next.fetch_add(1, Ordering::Relaxed) + 1;

        std::thread::Builder::new().name(format!("pty-{id}")).spawn(move || {
            let mut buf = [0u8; 16 * 1024];
            let mut pending: Vec<u8> = Vec::with_capacity(32 * 1024);
            let mut last_flush = Instant::now();
            loop {
                match reader.read(&mut buf) {
                    Ok(0) | Err(_) => break,
                    Ok(n) => {
                        pending.extend_from_slice(&buf[..n]);
                        // Flush when idle-ish or large; reads block, so a short read means "for now that's all".
                        if n < buf.len() || pending.len() > 64 * 1024 || last_flush.elapsed() > Duration::from_millis(16) {
                            on_data(std::mem::take(&mut pending));
                            last_flush = Instant::now();
                        }
                    }
                }
            }
            if !pending.is_empty() {
                on_data(pending);
            }
            on_exit();
        })?;

        self.terms.lock().unwrap().insert(id, Term { master: pair.master, writer, child });
        Ok(id)
    }

    pub fn write(&self, id: u32, data: &[u8]) -> anyhow::Result<()> {
        let mut terms = self.terms.lock().unwrap();
        let t = terms.get_mut(&id).ok_or_else(|| anyhow!("terminal closed"))?;
        t.writer.write_all(data)?;
        t.writer.flush()?;
        Ok(())
    }

    pub fn resize(&self, id: u32, cols: u16, rows: u16) -> anyhow::Result<()> {
        let terms = self.terms.lock().unwrap();
        let t = terms.get(&id).ok_or_else(|| anyhow!("terminal closed"))?;
        t.master.resize(PtySize { rows: rows.max(2), cols: cols.max(10), pixel_width: 0, pixel_height: 0 })?;
        Ok(())
    }

    pub fn kill(&self, id: u32) {
        if let Some(mut t) = self.terms.lock().unwrap().remove(&id) {
            let _ = t.child.kill();
        }
    }

    pub fn kill_all(&self) {
        for (_, mut t) in self.terms.lock().unwrap().drain() {
            let _ = t.child.kill();
        }
    }
}

impl Drop for Terminals {
    fn drop(&mut self) {
        self.kill_all();
    }
}
