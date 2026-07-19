import json
import os
import sqlite3
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


PORT = int(os.getenv("PYTHON_ANALYTICS_PORT", "8001"))
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", "./data/kms.sqlite")).resolve()
GROUPS = ["Kisgyerek", "Gyerek", "Felnőtt"]


def current_month_key():
    now = datetime.now()
    return f"{now.year}-{now.month:02d}"


def current_semester_key():
    now = datetime.now()
    return f"{now.year}-{'09' if now.month >= 9 else '01'}"


def current_year_key():
    return str(datetime.now().year)


def fetch_analytics():
    if not DATABASE_PATH.exists():
        return {
            "source": "python",
            "periods": {
                "month": current_month_key(),
                "semester": current_semester_key(),
                "year": current_year_key(),
            },
            "totals": {"students": 0, "monthlyDue": 0, "semesterDue": 0, "annualDue": 0},
            "groups": [{"name": group, "total": 0, "monthlyPaid": 0, "monthlyRatio": 0} for group in GROUPS],
            "attention": [],
        }

    con = sqlite3.connect(DATABASE_PATH)
    con.row_factory = sqlite3.Row
    try:
        month = current_month_key()
        semester = current_semester_key()
        year = current_year_key()

        rows = con.execute(
            """
            SELECT
              s.id,
              s.full_name,
              s.group_name,
              MAX(CASE WHEN p.type = 'monthly' AND p.period = ? THEN 1 ELSE 0 END) AS monthly_paid,
              MAX(CASE WHEN p.type = 'semester' AND p.period = ? THEN 1 ELSE 0 END) AS semester_paid,
              MAX(CASE WHEN p.type = 'annual' AND p.period = ? THEN 1 ELSE 0 END) AS annual_paid
            FROM students s
            LEFT JOIN payments p ON p.student_id = s.id
            GROUP BY s.id
            ORDER BY s.full_name COLLATE NOCASE ASC
            """,
            (month, semester, year),
        ).fetchall()

        students = [
            {
                "id": row["id"],
                "fullName": row["full_name"],
                "group": row["group_name"],
                "payments": {
                    "monthly": bool(row["monthly_paid"]),
                    "semester": bool(row["semester_paid"]),
                    "annual": bool(row["annual_paid"]),
                },
            }
            for row in rows
        ]

        groups = []
        for group in GROUPS:
            group_students = [student for student in students if student["group"] == group]
            monthly_paid = len([student for student in group_students if student["payments"]["monthly"]])
            groups.append(
                {
                    "name": group,
                    "total": len(group_students),
                    "monthlyPaid": monthly_paid,
                    "monthlyRatio": round((monthly_paid / len(group_students)) * 100) if group_students else 0,
                }
            )

        return {
            "source": "python",
            "periods": {"month": month, "semester": semester, "year": year},
            "totals": {
                "students": len(students),
                "monthlyDue": len([student for student in students if not student["payments"]["monthly"]]),
                "semesterDue": len([student for student in students if not student["payments"]["semester"]]),
                "annualDue": len([student for student in students if not student["payments"]["annual"]]),
            },
            "groups": groups,
            "attention": [
                student
                for student in students
                if not student["payments"]["monthly"]
                or not student["payments"]["semester"]
                or not student["payments"]["annual"]
            ][:8],
        }
    finally:
        con.close()


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_json({"ok": True, "service": "python", "database": str(DATABASE_PATH)})
            return

        if self.path == "/analytics":
            self.send_json(fetch_analytics())
            return

        self.send_json({"error": "Not found"}, status=404)

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Python analytics: http://127.0.0.1:{PORT}")
    server.serve_forever()
