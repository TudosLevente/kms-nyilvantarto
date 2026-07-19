export function BrandMark({ small = false }) {
  return <div className={`brand-mark ${small ? "small" : ""}`} aria-hidden="true">KMS</div>;
}
