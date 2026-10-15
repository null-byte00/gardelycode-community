//! Tiny static file server for previewing plain HTML/CSS/JS projects in the
//! Stage pane. Projects with their own dev server (Vite etc.) use that URL instead.

use std::path::{Path, PathBuf};
use std::sync::{Arc, RwLock};

pub struct PreviewServer {
    root: Arc<RwLock<PathBuf>>,
    port: u16,
}

fn mime(path: &Path) -> &'static str {
    match path.extension().and_then(|e| e.to_str()).map(str::to_ascii_lowercase).as_deref() {
        Some("html" | "htm") => "text/html; charset=utf-8",
        Some("css") => "text/css; charset=utf-8",
        Some("js" | "mjs") => "text/javascript; charset=utf-8",
        Some("json") => "application/json",
        Some("svg") => "image/svg+xml",
        Some("png") => "image/png",
        Some("jpg" | "jpeg") => "image/jpeg",
        Some("gif") => "image/gif",
        Some("webp") => "image/webp",
        Some("ico") => "image/x-icon",
        Some("woff2") => "font/woff2",
        Some("woff") => "font/woff",
        Some("mp4") => "video/mp4",
        Some("mp3") => "audio/mpeg",
        Some("wasm") => "application/wasm",
        _ => "application/octet-stream",
    }
}

impl PreviewServer {
    /// Bind to 127.0.0.1 on a free port and serve `root` on a background thread.
    pub fn start(root: PathBuf) -> anyhow::Result<Self> {
        let server = tiny_http::Server::http("127.0.0.1:0").map_err(|e| anyhow::anyhow!("{e}"))?;
        let port = server.server_addr().to_ip().map(|a| a.port()).unwrap_or(0);
        let root = Arc::new(RwLock::new(root));
        let shared = root.clone();
        std::thread::Builder::new().name("preview".into()).spawn(move || {
            for req in server.incoming_requests() {
                let base = shared.read().unwrap().clone();
                let url = req.url().split(['?', '#']).next().unwrap_or("/").to_string();
                let decoded = percent_decode(&url);
                let mut path = base.clone();
                let mut ok = true;
                for seg in decoded.split('/').filter(|s| !s.is_empty()) {
                    if seg == ".." || seg.contains('\\') || seg.contains(':') {
                        ok = false;
                        break;
                    }
                    path.push(seg);
                }
                if ok && path.is_dir() {
                    path.push("index.html");
                }
                let resp = if ok && path.starts_with(&base) && path.is_file() {
                    match std::fs::read(&path) {
                        Ok(bytes) => tiny_http::Response::from_data(bytes)
                            .with_header(tiny_http::Header::from_bytes("Content-Type", mime(&path)).unwrap())
                            .with_header(tiny_http::Header::from_bytes("Cache-Control", "no-store").unwrap()),
                        Err(_) => tiny_http::Response::from_string("read error").with_status_code(500),
                    }
                } else {
                    tiny_http::Response::from_string("Not found").with_status_code(404)
                };
                let _ = req.respond(resp);
            }
        })?;
        Ok(Self { root, port })
    }

    pub fn set_root(&self, root: PathBuf) {
        *self.root.write().unwrap() = root;
    }

    pub fn url(&self) -> String {
        format!("http://127.0.0.1:{}/", self.port)
    }
}

fn percent_decode(s: &str) -> String {
    let bytes = s.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' && i + 2 < bytes.len() {
            if let Ok(b) = u8::from_str_radix(&s[i + 1..i + 3], 16) {
                out.push(b);
                i += 3;
                continue;
            }
        }
        out.push(bytes[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}
