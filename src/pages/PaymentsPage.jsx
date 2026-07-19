import { PAYMENT_LABELS } from "../constants.js";
import { PaymentColumn } from "../components/payments/PaymentColumn.jsx";

export function PaymentsPage({ students, onToggle, onOpenProfile }) {
  return (
    <section className="payments-layout">
      {Object.entries(PAYMENT_LABELS).map(([type, title]) => (
        <PaymentColumn
          key={type}
          students={students}
          title={title}
          type={type}
          onToggle={onToggle}
          onOpenProfile={onOpenProfile}
        />
      ))}
    </section>
  );
}
