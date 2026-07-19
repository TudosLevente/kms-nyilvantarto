export function Metric({ label, value, tone = "", icon }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{icon}{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
