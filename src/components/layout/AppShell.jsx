import { LogOut, Plus, Search } from "lucide-react";
import { BrandMark } from "../ui/BrandMark.jsx";

export function AppShell({ children, onAddStudent, onLogout, searchTerm, setSearchTerm, view, setView }) {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <BrandMark small />
          <div>
            <strong>KMS Dojo</strong>
            <span>Nyilvántartó</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Fő navigáció">
          <NavButton active={view === "overview"} onClick={() => setView("overview")}>Áttekintés</NavButton>
          <NavButton active={view === "students"} onClick={() => setView("students")}>Tanítványok</NavButton>
          <NavButton active={view === "payments"} onClick={() => setView("payments")}>Díjak</NavButton>
        </nav>
      </aside>

      <section className="content-shell">
        <header className="topbar">
          <div>
            <h1>{viewTitle(view)}</h1>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Keresés név, szülő vagy email alapján" />
            </label>
            <button className="primary-button" type="button" onClick={onAddStudent}>
              <Plus size={18} /> <span className="hide-on-mobile">Tanítvány</span>
            </button>
            <button className="ghost-button logout-btn-top" type="button" onClick={onLogout} aria-label="Kilépés" title="Kilépés">
              <LogOut size={18} /> <span className="hide-on-mobile">Kilépés</span>
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

function NavButton({ active, children, onClick }) {
  return (
    <button className={`nav-item ${active ? "is-active" : ""}`} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function viewTitle(view) {
  return {
    overview: "Áttekintés",
    students: "Tanítványok",
    payments: "Díjak",
    profile: "Tanítvány profil",
  }[view];
}
