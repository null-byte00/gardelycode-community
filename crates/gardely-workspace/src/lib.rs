//! Workspace services for the UI: file tree and fs ops, text search, change
//! watcher, PTY terminals and a static preview server. No Tauri types here —
//! the app crate adapts callbacks to Channels/events.

mod files;
mod preview;
mod search;
mod terminal;
mod watch;

pub use files::{FileContent, FileNode, Workspace};
pub use preview::PreviewServer;
pub use search::{SearchHit, search};
pub use terminal::Terminals;
pub use watch::{Watcher, watch};
