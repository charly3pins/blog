import { useState } from "react";

const BOOKS = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", note: "The bible for backend engineers." },
  { title: "Clean Architecture", author: "Robert C. Martin", note: "Changed how I think about boundaries." },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", note: "Re-read it every couple of years." },
  { title: "Staff Engineer", author: "Will Larson", note: "Essential if you're navigating IC vs management." },
  { title: "An Elegant Puzzle", author: "Will Larson", note: "Engineering orgs, honestly." },
];

const TOOLS = [
  { name: "Neovim",          desc: "Editor. Configured from scratch." },
  { name: "Bun",             desc: "JS runtime. Fast enough." },
  { name: "Hetzner + Coolify", desc: "Personal infra. Cheap and reliable." },
  { name: "Obsidian",        desc: "Second brain. Everything lives here." },
  { name: "Ghostty",         desc: "Terminal. Beautiful and snappy." },
  { name: "GNU Stow",        desc: "Dotfiles manager. Never going back." },
];

const RESOURCES = [
  { name: "Total TypeScript", author: "Matt Pocock",  type: "Course" },
  { name: "ThePrimeagen",     author: "YouTube",       type: "Channel" },
  { name: "DotCSV",           author: "YouTube · ES",  type: "Channel" },
  { name: "Álvaro 845",       author: "YouTube · ES",  type: "Channel" },
  { name: "Syntax.fm",        author: "Podcast",       type: "Podcast" },
  { name: "Lenny's Newsletter", author: "Newsletter",  type: "Newsletter" },
];

const TABS = ["books", "tools", "resources"] as const;
type Tab = typeof TABS[number];

const colHeader: React.CSSProperties = {
  fontSize: "9px",
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: "var(--dim)",
  paddingBottom: "12px",
  borderBottom: "1px solid var(--faint)",
  display: "grid",
};

const rowLine: React.CSSProperties = {
  borderBottom: "1px solid var(--faint)",
};

export default function LibraryTabs() {
  const [tab, setTab] = useState<Tab>("books");

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "32px", marginBottom: "48px" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0 6px 0",
              color: tab === t ? "var(--fg)" : "var(--dim)",
              borderBottom: tab === t ? "1px solid var(--red)" : "1px solid transparent",
              transition: "color 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Books */}
      {tab === "books" && (
        <div>
          <div style={{ ...colHeader, gridTemplateColumns: "1fr 1fr" }}>
            <span>Title / Author</span>
            <span>Note</span>
          </div>
          {BOOKS.map((b, i) => (
            <div key={i} style={{ ...rowLine, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "baseline", padding: "18px 0" }}>
              <div>
                <div style={{ fontSize: "14px", color: "var(--fg)", marginBottom: "4px" }}>{b.title}</div>
                <div style={{ fontSize: "11px", color: "var(--dim)", fontStyle: "italic" }}>{b.author}</div>
              </div>
              <div style={{ fontSize: "13px", color: "var(--dim)", fontWeight: 300, lineHeight: 1.7 }}>{b.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tools */}
      {tab === "tools" && (
        <div>
          <div style={{ ...colHeader, gridTemplateColumns: "140px 1fr" }}>
            <span>Tool</span>
            <span>Why</span>
          </div>
          {TOOLS.map((t, i) => (
            <div key={i} style={{ ...rowLine, display: "grid", gridTemplateColumns: "140px 1fr", gap: "40px", alignItems: "baseline", padding: "16px 0" }}>
              <span style={{ fontSize: "14px", color: "var(--fg)" }}>{t.name}</span>
              <span style={{ fontSize: "13px", color: "var(--dim)", fontWeight: 300 }}>{t.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      {tab === "resources" && (
        <div>
          <div style={{ ...colHeader, gridTemplateColumns: "1fr 120px 80px" }}>
            <span>Name</span>
            <span>Author</span>
            <span>Type</span>
          </div>
          {RESOURCES.map((r, i) => (
            <div key={i} style={{ ...rowLine, display: "grid", gridTemplateColumns: "1fr 120px 80px", gap: "40px", alignItems: "baseline", padding: "16px 0" }}>
              <span style={{ fontSize: "14px", color: "var(--fg)" }}>{r.name}</span>
              <span style={{ fontSize: "13px", color: "var(--dim)", fontWeight: 300 }}>{r.author}</span>
              <span style={{ fontSize: "11px", color: "var(--red)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{r.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
