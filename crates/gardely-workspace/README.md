# gardely-workspace

The workspace layer that powers [GardelyCode](https://github.com/null-byte00/gardelycode-community): everything the IDE needs to show and touch a project on disk — no UI framework, no Tauri types, just Rust.

| Module | What it does |
|---|---|
| `Workspace` | Open a folder, list a tree (folders first, junk like `node_modules` hidden), read/write/create/rename/delete — every path confined to the project root |
| `search` | Full-text search on the ripgrep engine, respects `.gitignore`, capped results |
| `watch` | Debounced recursive file watcher that reports project-relative paths |
| `Terminals` | Interactive shells over ConPTY/PTY with output coalesced into ~16 ms chunks |
| `PreviewServer` | Tiny static server on `127.0.0.1:<free port>` for previewing plain HTML/CSS/JS projects |

```rust
use gardely_workspace::{Workspace, search, PreviewServer};

let ws = Workspace::open("C:/projects/coffee-shop")?;
for node in ws.tree(None, 2)? {
    println!("{}{}", node.path, if node.is_dir { "/" } else { "" });
}
let hits = search(&ws, "book a table", false, false)?;
let preview = PreviewServer::start(ws.root.clone())?;
println!("preview at {}", preview.url());
```

MIT licensed. Part of GardelyCode's open modules — the agent, the Gardely AI models and the interface are proprietary.
