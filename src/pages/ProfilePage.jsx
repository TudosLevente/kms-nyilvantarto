import { ArrowLeft, Mail, Phone, WalletCards } from "lucide-react";
import { PAYMENT_LABELS } from "../constants.js";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import { calculateAge, formatDate } from "../utils/date.js";

export function ProfilePage({ profile, onBack, onEdit, onTogglePayment }) {
  if (!profile) {
    return <div className="empty-state">Nincs kiválasztott tanítvány.</div>;
  }

  const { student, paymentHistory, totals } = profile;

  return (
    <section className="profile-view">
      <button className="ghost-button back-button" type="button" onClick={onBack}>
        <ArrowLeft size={18} /> Vissza
      </button>

      <section className="profile-hero">
        <div className="rank-stamp">{student.beltRank}</div>
        <div>
          <p className="eyebrow">{student.group}</p>
          <h2>{student.fullName}</h2>
          <span>{calculateAge(student.birthDate)} éves · született: {formatDate(student.birthDate)}</span>
        </div>
        <button className="primary-button" type="button" onClick={() => onEdit(student)}>Szerkesztés</button>
      </section>

      <div className="profile-grid">
        <section className="band">
          <div className="section-heading">
            <h2>Kapcsolat</h2>
          </div>
          <div className="contact-list">
            <span>Szülő: <strong>{student.parentName || "nincs megadva"}</strong></span>
            <span><Phone size={16} /> {student.parentPhone || "nincs megadva"}</span>
            <span><Mail size={16} /> {student.parentEmail || "nincs megadva"}</span>
          </div>
        </section>

        <section className="band">
          <div className="section-heading">
            <h2>Aktuális befizetések</h2>
          </div>
          <div className="profile-status-grid">
            {Object.entries(PAYMENT_LABELS).map(([type, label]) => (
              <div className="status-panel" key={type}>
                <StatusBadge label={label} paid={student.payments[type]} />
                <button className="payment-action" type="button" onClick={() => onTogglePayment(student.id, type)}>
                  {student.payments[type] ? "Visszavonás" : "Rögzítés"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="band">
        <div className="section-heading">
          <h2>Fizetési előzmények</h2>
          <span>{totals.all} rögzített befizetés</span>
        </div>
        <div className="history-stats">
          <span>Havi: <strong>{totals.monthly}</strong></span>
          <span>Féléves: <strong>{totals.semester}</strong></span>
          <span>Éves: <strong>{totals.annual}</strong></span>
        </div>
        <div className="history-list">
          {paymentHistory.length ? paymentHistory.map((payment) => (
            <article className="history-row" key={payment.id}>
              <div className="history-icon"><WalletCards size={18} /></div>
              <div>
                <strong>{PAYMENT_LABELS[payment.type]}</strong>
                <span>{payment.period}</span>
              </div>
              <time>{formatDate(payment.paidAt)}</time>
            </article>
          )) : <div className="empty-state">Még nincs rögzített befizetés ehhez a tanítványhoz.</div>}
        </div>
      </section>
    </section>
  );
}
