import { CheckCircle2, Eye, Pencil, ReceiptText } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge.jsx";
import { calculateAge, formatDate } from "../../utils/date.js";

export function StudentCard({ student, onEdit, onMonthly, onOpenProfile }) {
  const monthlyPaid = student.payments.monthly;

  return (
    <article className="student-card">
      <div className="student-card-header">
        <button className="profile-link" type="button" onClick={() => onOpenProfile(student.id)}>
          <h2>{student.fullName}</h2>
          <span className="student-meta">{student.group} · {student.beltRank}</span>
        </button>
        <span className="badge age-badge">{calculateAge(student.birthDate)} éves</span>
      </div>
      <div className="badge-row">
        <StatusBadge label="Havi" paid={student.payments.monthly} />
        <StatusBadge label="Féléves" paid={student.payments.semester} />
        <StatusBadge label="Éves" paid={student.payments.annual} />
      </div>

      <div className="student-last-payment">
        <ReceiptText size={16} />
        <span>Utolsó havi befizetés</span>
        <strong>{formatDate(student.payments.lastMonthlyPaymentDate)}</strong>
      </div>

      <div className="student-actions">
        <button className="student-action profile" type="button" onClick={() => onOpenProfile(student.id)}><Eye size={16} /> Profil</button>
        <button className="student-action edit" type="button" onClick={() => onEdit(student)}><Pencil size={16} /> Adatok</button>
        <button className={`student-action monthly ${monthlyPaid ? "is-paid" : "is-due"}`} type="button" onClick={() => onMonthly(student.id)}>
          <CheckCircle2 size={16} /> {monthlyPaid ? "Befizetve" : "Havi díj"}
        </button>
      </div>
    </article>
  );
}
