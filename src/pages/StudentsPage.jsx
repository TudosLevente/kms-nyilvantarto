import { GROUPS } from "../constants.js";
import { StudentCard } from "../components/students/StudentCard.jsx";

export function StudentsPage({ students, groupFilter, setGroupFilter, onEdit, onMonthly, onOpenProfile }) {
  return (
    <section className="view">
      <div className="students-panel">
        <div>
          <p className="eyebrow">Tanítványlista</p>
          <h2>{students.length} megjelenített tanítvány</h2>
        </div>
        <div className="segmented-control" aria-label="Csoport szűrő">
          {["all", ...GROUPS].map((group) => (
            <button
              className={`segment ${groupFilter === group ? "is-active" : ""}`}
              key={group}
              type="button"
              onClick={() => setGroupFilter(group)}
            >
              {group === "all" ? "Mind" : group}
            </button>
          ))}
        </div>
      </div>
      <div className="student-grid">
        {students.length ? students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={onEdit}
            onMonthly={onMonthly}
            onOpenProfile={onOpenProfile}
          />
        )) : <div className="empty-state">Nincs megjeleníthető tanítvány.</div>}
      </div>
    </section>
  );
}
