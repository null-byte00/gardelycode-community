use std::path::{Component, Path, PathBuf};

use anyhow::{Context, bail};
use serde::Serialize;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FileNode {
    pub name: String,
    /// Relative to the workspace root, forward slashes.
    pub path: String,
    pub is_dir: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<FileNode>>,
}

#[derive(Serialize, Clone, Debug)]
pub struct FileContent {
    pub content: String,
    pub binary: bool,
}

/// Folders hidden from the tree (still searchable by path if the user asks).
const HIDDEN: &[&str] = &[".git", "node_modules", "target", "dist", ".next", ".turbo", "__pycache__", ".venv"];

#[derive(Clone, Debug)]
pub struct Workspace {
    pub root: PathBuf,
}

impl Workspace {
    pub fn open(path: impl Into<PathBuf>) -> anyhow::Result<Self> {
        let root = std::fs::canonicalize(path.into()).context("folder not found")?;
        if !root.is_dir() {
            bail!("not a folder");
        }
        // canonicalize on Windows yields \\?\C:\…; strip it for display and child processes.
        let s = root.to_string_lossy();
        let root = PathBuf::from(s.strip_prefix(r"\\?\").unwrap_or(&s).to_string());
        Ok(Self { root })
    }

    pub fn name(&self) -> String {
        self.root.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_else(|| self.root.to_string_lossy().to_string())
    }

    pub fn resolve(&self, rel: &str) -> anyhow::Result<PathBuf> {
        let rel = rel.replace('\\', "/");
        let mut out = self.root.clone();
        for c in Path::new(rel.trim_start_matches('/')).components() {
            match c {
                Component::Normal(p) => out.push(p),
                Component::CurDir => {}
                Component::ParentDir => {
                    if !out.pop() || !out.starts_with(&self.root) {
                        bail!("path escapes the project");
                    }
                }
                _ => bail!("absolute paths are not allowed"),
            }
        }
        Ok(out)
    }

    fn rel(&self, abs: &Path) -> String {
        abs.strip_prefix(&self.root).unwrap_or(abs).to_string_lossy().replace('\\', "/")
    }

    /// Directory listing, `depth` levels deep (1 = direct children). Folders first, then files, alphabetically.
    pub fn tree(&self, rel: Option<&str>, depth: u32) -> anyhow::Result<Vec<FileNode>> {
        let dir = self.resolve(rel.unwrap_or(""))?;
        self.list(&dir, depth.max(1))
    }

    fn list(&self, dir: &Path, depth: u32) -> anyhow::Result<Vec<FileNode>> {
        let mut nodes = Vec::new();
        for e in std::fs::read_dir(dir)?.flatten() {
            let name = e.file_name().to_string_lossy().to_string();
            let is_dir = e.file_type().map(|t| t.is_dir()).unwrap_or(false);
            if is_dir && HIDDEN.contains(&name.as_str()) {
                continue;
            }
            let path = e.path();
            let children = if is_dir && depth > 1 { Some(self.list(&path, depth - 1).unwrap_or_default()) } else { None };
            nodes.push(FileNode { name, path: self.rel(&path), is_dir, children });
        }
        nodes.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then_with(|| a.name.to_lowercase().cmp(&b.name.to_lowercase())));
        Ok(nodes)
    }

    pub fn read(&self, rel: &str) -> anyhow::Result<FileContent> {
        let bytes = std::fs::read(self.resolve(rel)?)?;
        if bytes.iter().take(8000).any(|b| *b == 0) || bytes.len() > 5_000_000 {
            return Ok(FileContent { content: String::new(), binary: true });
        }
        Ok(FileContent { content: String::from_utf8_lossy(&bytes).into_owned(), binary: false })
    }

    pub fn write(&self, rel: &str, content: &str) -> anyhow::Result<()> {
        let p = self.resolve(rel)?;
        if let Some(parent) = p.parent() {
            std::fs::create_dir_all(parent)?;
        }
        Ok(std::fs::write(p, content)?)
    }

    pub fn create(&self, rel: &str, is_dir: bool) -> anyhow::Result<()> {
        let p = self.resolve(rel)?;
        if p.exists() {
            bail!("already exists");
        }
        if is_dir {
            std::fs::create_dir_all(p)?;
        } else {
            if let Some(parent) = p.parent() {
                std::fs::create_dir_all(parent)?;
            }
            std::fs::write(p, "")?;
        }
        Ok(())
    }

    pub fn rename(&self, from: &str, to: &str) -> anyhow::Result<()> {
        let (a, b) = (self.resolve(from)?, self.resolve(to)?);
        if b.exists() {
            bail!("target already exists");
        }
        Ok(std::fs::rename(a, b)?)
    }

    pub fn delete(&self, rel: &str) -> anyhow::Result<()> {
        let p = self.resolve(rel)?;
        if p == self.root {
            bail!("refusing to delete the project root");
        }
        if p.is_dir() { std::fs::remove_dir_all(p)? } else { std::fs::remove_file(p)? }
        Ok(())
    }
}
