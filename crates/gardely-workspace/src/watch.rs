use std::path::Path;
use std::time::Duration;

use notify::RecursiveMode;
use notify_debouncer_full::{DebounceEventResult, Debouncer, RecommendedCache, new_debouncer};

pub type Watcher = Debouncer<notify::RecommendedWatcher, RecommendedCache>;

const IGNORED: &[&str] = &["/.git/", "/node_modules/", "/target/", "/dist/", "/.next/"];

/// Watch `root` recursively; `on_change` gets project-relative paths, debounced.
/// Keep the returned watcher alive for as long as watching should continue.
pub fn watch(root: &Path, on_change: impl Fn(Vec<String>) + Send + 'static) -> anyhow::Result<Watcher> {
    let base = root.to_path_buf();
    let mut debouncer = new_debouncer(Duration::from_millis(250), None, move |res: DebounceEventResult| {
        let Ok(events) = res else { return };
        let mut paths: Vec<String> = events
            .iter()
            .flat_map(|e| e.paths.iter())
            .map(|p| p.strip_prefix(&base).unwrap_or(p).to_string_lossy().replace('\\', "/"))
            .filter(|p| {
                let slashed = format!("/{p}/");
                !IGNORED.iter().any(|ig| slashed.contains(ig))
            })
            .collect();
        paths.sort();
        paths.dedup();
        if !paths.is_empty() {
            on_change(paths);
        }
    })?;
    debouncer.watch(root, RecursiveMode::Recursive)?;
    Ok(debouncer)
}
