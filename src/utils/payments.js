export function missingLabels(student) {
  const labels = [];
  if (!student.payments.monthly) labels.push("havi tagdíj");
  if (!student.payments.semester) labels.push("féléves tagsági díj");
  if (!student.payments.annual) labels.push("éves egyesületi díj");
  return labels;
}
