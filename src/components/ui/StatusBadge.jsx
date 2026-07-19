export function StatusBadge({ label, paid }) {
  return <span className={`badge ${paid ? "ok" : "due"}`}>{label}: {paid ? "rendezve" : "hiányzik"}</span>;
}
