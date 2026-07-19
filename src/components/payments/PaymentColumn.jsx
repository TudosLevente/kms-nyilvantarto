import { formatDate } from "../../utils/date.js";

export function PaymentColumn({ students, title, type, onToggle, onOpenProfile }) {
  return (
    <section className="payment-column">
      <h2>{title}</h2>
      <div className="payment-list">
        {students.length ? students.map((student) => {
          const paid = student.payments[type];
          return (
            <article className="payment-row" key={`${type}-${student.id}`}>
              <button className="payment-person" type="button" onClick={() => onOpenProfile(student.id)}>
                <strong>{student.fullName}</strong>
                <span className="payment-meta">{student.group} · {paymentMeta(student, type)}</span>
              </button>
              <button className={`payment-action ${paid ? "is-paid" : ""}`} type="button" onClick={() => onToggle(student.id, type)}>
                {paid ? "Rendezve" : "Rögzítés"}
              </button>
            </article>
          );
        }) : <div className="empty-state">Nincs megjeleníthető tanítvány.</div>}
      </div>
    </section>
  );
}

function paymentMeta(student, type) {
  const dateMap = {
    monthly: student.payments.lastMonthlyPaymentDate,
    semester: student.payments.lastSemesterPaymentDate,
    annual: student.payments.lastAnnualPaymentDate,
  };
  return `Utolsó fizetés: ${formatDate(dateMap[type])}`;
}
