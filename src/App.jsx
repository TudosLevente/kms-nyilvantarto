import { useEffect, useMemo, useState } from "react";
import { createApi } from "./api/client.js";
import { AppShell } from "./components/layout/AppShell.jsx";
import { StudentDialog } from "./components/students/StudentDialog.jsx";
import { emptyStudent, TOKEN_KEY } from "./constants.js";
import { useAppData } from "./hooks/useAppData.js";
import { LoginPage } from "./pages/LoginPage.jsx";
import { OverviewPage } from "./pages/OverviewPage.jsx";
import { PaymentsPage } from "./pages/PaymentsPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { StudentsPage } from "./pages/StudentsPage.jsx";

export function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [route, setRoute] = useState(() => getRouteFromPath());
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [editingStudent, setEditingStudent] = useState(null);
  const view = route.view;

  const handleLogout = useMemo(() => () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    window.history.replaceState(null, "", "/");
    setRoute({ view: "overview" });
    setEditingStudent(null);
  }, []);

  const {
    analytics,
    error,
    loading,
    loadData,
    loadProfile,
    overview,
    profile,
    removeStudent,
    saveStudent,
    setError,
    setProfile,
    students,
    togglePayment,
  } = useAppData(token, handleLogout);

  useEffect(() => {
    function handlePopState() {
      setRoute(getRouteFromPath());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (token) loadData();
  }, [loadData, token]);

  useEffect(() => {
    if (!token || route.view !== "profile") return;

    async function loadCurrentProfile() {
      try {
        await loadProfile(route.studentId);
      } catch {
        window.history.replaceState(null, "", "/");
        setRoute({ view: "students" });
      }
    }

    loadCurrentProfile();
  }, [loadProfile, route, token]);

  async function handleLogin(credentials) {
    const response = await createApi().post("/api/auth/login", credentials);
    localStorage.setItem(TOKEN_KEY, response.token);
    setEditingStudent(null);
    setToken(response.token);
  }

  function navigate(viewName) {
    const nextRoute = { view: viewName };
    window.history.pushState(null, "", pathForRoute(nextRoute));
    setProfile(null);
    setRoute(nextRoute);
  }

  function openProfile(studentId) {
    const nextRoute = { view: "profile", studentId };
    window.history.pushState(null, "", pathForRoute(nextRoute));
    setRoute(nextRoute);
  }

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return students.filter((student) => {
      const groupMatches = groupFilter === "all" || student.group === groupFilter;
      const searchMatches = !term || [
        student.fullName,
        student.parentName,
        student.parentEmail,
        student.parentPhone,
      ].filter(Boolean).some((value) => value.toLowerCase().includes(term));
      return groupMatches && searchMatches;
    });
  }, [students, searchTerm, groupFilter]);

  if (!token) {
    return <LoginPage onLogin={handleLogin} error={error} setError={setError} />;
  }

  return (
    <AppShell
      onAddStudent={() => setEditingStudent(emptyStudent)}
      onLogout={handleLogout}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      view={view}
      setView={navigate}
    >
      {error && <div className="alert">{error}</div>}
      {loading && <div className="loading-line" />}

      {view === "overview" && <OverviewPage overview={overview} analytics={analytics} onOpenProfile={openProfile} />}
      {view === "students" && (
        <StudentsPage
          students={filteredStudents}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          onEdit={setEditingStudent}
          onMonthly={(id) => togglePayment(id, "monthly")}
          onOpenProfile={openProfile}
        />
      )}
      {view === "payments" && (
        <PaymentsPage students={filteredStudents} onToggle={togglePayment} onOpenProfile={openProfile} />
      )}
      {view === "profile" && (
        <ProfilePage
          profile={profile}
          onBack={() => {
            setProfile(null);
            navigate("students");
          }}
          onEdit={setEditingStudent}
          onTogglePayment={togglePayment}
        />
      )}

      {editingStudent && (
        <StudentDialog
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={async (payload) => {
            setEditingStudent(null);
            await saveStudent(payload);
          }}
          onDelete={async (id) => {
            setEditingStudent(null);
            await removeStudent(id);
          }}
        />
      )}
    </AppShell>
  );
}

function getRouteFromPath() {
  const match = window.location.pathname.match(/^\/students\/(\d+)\/?$/);
  if (match) return { view: "profile", studentId: Number(match[1]) };
  if (window.location.pathname === "/students") return { view: "students" };
  if (window.location.pathname === "/payments") return { view: "payments" };
  return { view: "overview" };
}

function pathForRoute(route) {
  if (route.view === "profile") return `/students/${route.studentId}`;
  if (route.view === "students") return "/students";
  if (route.view === "payments") return "/payments";
  return "/";
}
