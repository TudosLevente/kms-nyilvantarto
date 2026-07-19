import { ShieldCheck, UserRoundPen, WalletCards } from "lucide-react";
import { Metric } from "../components/dashboard/Metric.jsx";
import { missingLabels } from "../utils/payments.js";

export function OverviewPage({ overview, analytics, onOpenProfile }) {
  const totals = analytics?.totals || overview?.totals || {};
  const groups = analytics?.groups || overview?.groups || [];
  const attention = overview?.attention || [];

  return (
    <section className="view">
      <div className="metric-grid">
        <Metric label="Tanítvány" value={totals.students || 0} icon={<UserRoundPen size={20} />} />
        <Metric label="Havi tagdíj hiányzik" value={totals.monthlyDue || 0} tone="due" icon={<WalletCards size={20} />} />
        <Metric label="Féléves díj hiányzik" value={totals.semesterDue || 0} tone="warn" icon={<WalletCards size={20} />} />
        <Metric label="Éves díj hiányzik" value={totals.annualDue || 0} tone="accent" icon={<ShieldCheck size={20} />} />
      </div>

      <section className="band">
        <div className="section-heading">
          <h2>Csoportok</h2>
          <span>{overview?.periods?.month || ""}</span>
        </div>
        <div className="group-summary">
          {groups.map((group) => (
            <article className="group-tile" key={group.name}>
              <strong>{group.total}</strong>
              <span>{group.name}</span>
              <div className="progress-track" aria-label={`${group.name} havi befizetés`}>
                <div className="progress-fill" style={{ width: `${group.monthlyRatio}%` }} />
              </div>
              <small>{group.monthlyPaid}/{group.total} havi tagdíj rendezve</small>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-heading">
          <h2>Figyelmet igényel</h2>
        </div>
        <div className="attention-list">
          {attention.length ? attention.map((student) => (
            <button className="attention-item as-button" key={student.id} type="button" onClick={() => onOpenProfile(student.id)}>
              <strong>{student.fullName}</strong>
              <span className="payment-meta">{missingLabels(student).join(" · ")}</span>
            </button>
          )) : <div className="empty-state">Nincs nyitott befizetési teendő.</div>}
        </div>
      </section>
    </section>
  );
}
