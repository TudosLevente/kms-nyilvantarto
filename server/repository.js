import { db, rowToStudent } from "./db.js";
import { currentMonthKey, currentSemesterKey, currentYearKey, periodForPaymentType } from "./date-utils.js";

const studentSelect = `
  SELECT
    s.*,
    MAX(CASE WHEN p.type = 'monthly' THEN p.paid_at END) AS last_monthly_payment_date,
    MAX(CASE WHEN p.type = 'semester' THEN p.paid_at END) AS last_semester_payment_date,
    MAX(CASE WHEN p.type = 'annual' THEN p.paid_at END) AS last_annual_payment_date,
    MAX(CASE WHEN p.type = 'monthly' AND p.period = @month THEN 1 ELSE 0 END) AS monthly_paid,
    MAX(CASE WHEN p.type = 'semester' AND p.period = @semester THEN 1 ELSE 0 END) AS semester_paid,
    MAX(CASE WHEN p.type = 'annual' AND p.period = @year THEN 1 ELSE 0 END) AS annual_paid
  FROM students s
  LEFT JOIN payments p ON p.student_id = s.id
`;

function currentParams() {
  return {
    month: currentMonthKey(),
    semester: currentSemesterKey(),
    year: currentYearKey(),
  };
}

function hydrateStudent(row) {
  return {
    ...rowToStudent(row),
    payments: {
      monthly: Boolean(row.monthly_paid),
      semester: Boolean(row.semester_paid),
      annual: Boolean(row.annual_paid),
      lastMonthlyPaymentDate: row.last_monthly_payment_date || "",
      lastSemesterPaymentDate: row.last_semester_payment_date || "",
      lastAnnualPaymentDate: row.last_annual_payment_date || "",
    },
  };
}

function rowToPayment(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    type: row.type,
    period: row.period,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

export function listStudents() {
  const rows = db.prepare(`
    ${studentSelect}
    GROUP BY s.id
    ORDER BY s.full_name COLLATE NOCASE ASC
  `).all(currentParams());
  return rows.map(hydrateStudent);
}

export function getStudent(id) {
  const row = db.prepare(`
    ${studentSelect}
    WHERE s.id = @id
    GROUP BY s.id
  `).get({ ...currentParams(), id });
  return row ? hydrateStudent(row) : null;
}

export function listPaymentsForStudent(studentId) {
  return db.prepare(`
    SELECT *
    FROM payments
    WHERE student_id = ?
    ORDER BY paid_at DESC, id DESC
  `).all(studentId).map(rowToPayment);
}

export function getStudentProfile(id) {
  const student = getStudent(id);
  if (!student) return null;

  const history = listPaymentsForStudent(id);
  const totals = history.reduce((acc, payment) => {
    acc[payment.type] += 1;
    acc.all += 1;
    return acc;
  }, { monthly: 0, semester: 0, annual: 0, all: 0 });

  return {
    student,
    paymentHistory: history,
    totals,
  };
}

export function createStudent(payload) {
  const result = db.prepare(`
    INSERT INTO students (
      full_name, birth_date, belt_rank, group_name, parent_name, parent_phone, parent_email
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    payload.fullName,
    payload.birthDate,
    payload.beltRank,
    payload.group,
    payload.parentName || "",
    payload.parentPhone || "",
    payload.parentEmail || "",
  );
  return getStudent(Number(result.lastInsertRowid));
}

export function updateStudent(id, payload) {
  db.prepare(`
    UPDATE students
    SET full_name = ?, birth_date = ?, belt_rank = ?, group_name = ?,
        parent_name = ?, parent_phone = ?, parent_email = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    payload.fullName,
    payload.birthDate,
    payload.beltRank,
    payload.group,
    payload.parentName || "",
    payload.parentPhone || "",
    payload.parentEmail || "",
    id,
  );
  return getStudent(id);
}

export function deleteStudent(id) {
  const result = db.prepare("DELETE FROM students WHERE id = ?").run(id);
  return result.changes > 0;
}

export function togglePayment(studentId, type) {
  const period = periodForPaymentType(type);
  const existing = db.prepare(`
    SELECT id FROM payments WHERE student_id = ? AND type = ? AND period = ?
  `).get(studentId, type, period);

  if (existing) {
    db.prepare("DELETE FROM payments WHERE id = ?").run(existing.id);
    return { paid: false, period, student: getStudent(studentId) };
  }

  const paidAt = new Date().toISOString().slice(0, 10);
  db.prepare(`
    INSERT INTO payments (student_id, type, period, paid_at)
    VALUES (?, ?, ?, ?)
  `).run(studentId, type, period, paidAt);
  return { paid: true, period, paidAt, student: getStudent(studentId) };
}

export function buildOverview() {
  const students = listStudents();
  const groups = ["Kisgyerek", "Gyerek", "Felnőtt"].map((group) => {
    const groupStudents = students.filter((student) => student.group === group);
    const monthlyPaid = groupStudents.filter((student) => student.payments.monthly).length;
    return {
      name: group,
      total: groupStudents.length,
      monthlyPaid,
      monthlyRatio: groupStudents.length ? Math.round((monthlyPaid / groupStudents.length) * 100) : 0,
    };
  });

  return {
    periods: {
      month: currentMonthKey(),
      semester: currentSemesterKey(),
      year: currentYearKey(),
    },
    totals: {
      students: students.length,
      monthlyDue: students.filter((student) => !student.payments.monthly).length,
      semesterDue: students.filter((student) => !student.payments.semester).length,
      annualDue: students.filter((student) => !student.payments.annual).length,
    },
    groups,
    attention: students
      .filter((student) => !student.payments.monthly || !student.payments.semester || !student.payments.annual)
      .slice(0, 8),
  };
}
