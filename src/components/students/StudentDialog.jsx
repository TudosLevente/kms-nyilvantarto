import { useEffect, useState } from "react";
import { BELTS, GROUPS } from "../../constants.js";

export function StudentDialog({ student, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(student);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isExisting = Boolean(student.id);

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()).toISOString().split("T")[0];

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || "Hiba történt a mentés során.");
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!window.confirm(`${student.fullName} törölhető a nyilvántartásból?`)) return;
    setIsSubmitting(true);
    try {
      await onDelete(student.id);
    } finally {
      onClose();
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="student-dialog" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" onMouseDown={(event) => event.stopPropagation()}>
        <form onSubmit={submit}>
          <div className="dialog-header">
            <div>
              <p className="eyebrow">Tanítvány adatlap</p>
              <h2 id="dialogTitle">{isExisting ? "Tanítvány szerkesztése" : "Új tanítvány"}</h2>
            </div>
            <button className="icon-button" type="button" aria-label="Bezárás" onClick={onClose}>×</button>
          </div>

          <div className="form-grid">
            <label>
              Teljes név
              <input 
                value={form.fullName} 
                onChange={(event) => update("fullName", event.target.value)} 
                minLength={3}
                maxLength={80}
                pattern="^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ \-\.]+$"
                title="Kérlek, csak betűket, szóközöket, kötőjelet vagy pontot használj!"
                required 
              />
            </label>
            <label>
              Születési dátum
              <input 
                value={form.birthDate} 
                onChange={(event) => update("birthDate", event.target.value)} 
                type="date" 
                min={minDate}
                max={maxDate}
                required 
              />
            </label>
            <label>
              Övfokozat
              <select value={form.beltRank} onChange={(event) => update("beltRank", event.target.value)} required>
                {BELTS.map((belt) => <option key={belt}>{belt}</option>)}
              </select>
            </label>
            <label>
              Csoport
              <select value={form.group} onChange={(event) => update("group", event.target.value)} required>
                {GROUPS.map((group) => <option key={group}>{group}</option>)}
              </select>
            </label>
            <label>
              Szülő neve
              <input 
                value={form.parentName || ""} 
                onChange={(event) => update("parentName", event.target.value)} 
                minLength={3}
                maxLength={80}
                pattern="^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ \-\.]+$"
                title="Kérlek, csak betűket, szóközöket, kötőjelet vagy pontot használj!"
              />
            </label>
            <label>
              Szülő telefonszáma
              <input 
                value={form.parentPhone || ""} 
                onChange={(event) => update("parentPhone", event.target.value)} 
                type="tel" 
                maxLength={30}
              />
            </label>
            <label className="wide">
              Szülő email címe
              <input 
                value={form.parentEmail || ""} 
                onChange={(event) => update("parentEmail", event.target.value)} 
                type="email" 
                maxLength={100}
              />
            </label>
          </div>

          {error && <p className="error-text" style={{ marginTop: "16px" }}>{error}</p>}

          <div className="dialog-actions" style={{ marginTop: error ? "16px" : "22px" }}>
            {isExisting && <button className="danger-button" type="button" onClick={confirmDelete} disabled={isSubmitting}>Törlés</button>}
            <div className="spacer" />
            <button className="ghost-button" type="button" onClick={onClose} disabled={isSubmitting}>Mégsem</button>
            <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Mentés..." : "Mentés"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
