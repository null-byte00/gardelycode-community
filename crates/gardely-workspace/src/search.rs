use grep_regex::RegexMatcherBuilder;
use grep_searcher::Searcher;
use grep_searcher::sinks::UTF8;
use ignore::WalkBuilder;
use serde::Serialize;

use crate::Workspace;

#[derive(Serialize, Clone, Debug)]
pub struct SearchHit {
    pub path: String,
    pub line: u64,
    pub text: String,
}

const MAX_HITS: usize = 2000;

/// ripgrep-engine search over the workspace (respects .gitignore).
pub fn search(ws: &Workspace, query: &str, is_regex: bool, case_sensitive: bool) -> anyhow::Result<Vec<SearchHit>> {
    if query.is_empty() {
        return Ok(Vec::new());
    }
    let pattern = if is_regex { query.to_string() } else { regex_escape(query) };
    let matcher = RegexMatcherBuilder::new().case_insensitive(!case_sensitive).build(&pattern)?;
    let mut hits = Vec::new();
    let mut searcher = Searcher::new();
    for entry in WalkBuilder::new(&ws.root).build().flatten() {
        if !entry.file_type().is_some_and(|t| t.is_file()) {
            continue;
        }
        let rel = entry.path().strip_prefix(&ws.root).unwrap_or(entry.path()).to_string_lossy().replace('\\', "/");
        let _ = searcher.search_path(
            &matcher,
            entry.path(),
            UTF8(|line, text| {
                hits.push(SearchHit { path: rel.clone(), line, text: text.trim_end().chars().take(300).collect() });
                Ok(hits.len() < MAX_HITS)
            }),
        );
        if hits.len() >= MAX_HITS {
            break;
        }
    }
    Ok(hits)
}

fn regex_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len() * 2);
    for c in s.chars() {
        if "\\.+*?()|[]{}^$#&-~".contains(c) {
            out.push('\\');
        }
        out.push(c);
    }
    out
}
