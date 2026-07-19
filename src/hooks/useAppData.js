import { useCallback, useMemo, useState } from "react";
import { createApi } from "../api/client.js";

export function useAppData(token, onUnauthorized) {
  const api = useMemo(() => createApi(token), [token]);
  const [students, setStudents] = useState([]);
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const guarded = useCallback(async (operation, { rethrow = true } = {}) => {
    try {
      setError("");
      return await operation();
    } catch (err) {
      if (err.status === 401) {
        setError("");
        onUnauthorized();
      } else {
        setError(err.message);
      }

      if (rethrow) throw err;
      return null;
    }
  }, [onUnauthorized]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      await guarded(async () => {
        const [studentData, overviewData, analyticsData] = await Promise.all([
          api.get("/api/students"),
          api.get("/api/overview"),
          api.get("/api/analytics"),
        ]);
        setStudents(studentData);
        setOverview(overviewData);
        setAnalytics(analyticsData);
      }, { rethrow: false });
    } finally {
      setLoading(false);
    }
  }, [api, guarded, token]);

  const loadProfile = useCallback(async (studentId) => {
    setLoading(true);
    try {
      const data = await guarded(() => api.get(`/api/students/${studentId}`));
      setProfile(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [api, guarded]);

  const saveStudent = useCallback(async (payload) => {
    await guarded(() => payload.id
      ? api.put(`/api/students/${payload.id}`, payload)
      : api.post("/api/students", payload));
    await loadData();
    if (profile?.student?.id === payload.id) await loadProfile(payload.id);
  }, [api, guarded, loadData, loadProfile, profile]);

  const removeStudent = useCallback(async (id) => {
    await guarded(() => api.delete(`/api/students/${id}`));
    setProfile(null);
    await loadData();
  }, [api, guarded, loadData]);

  const togglePayment = useCallback(async (studentId, type) => {
    await guarded(() => api.post("/api/payments/toggle", { studentId, type }));
    await loadData();
    if (profile?.student?.id === studentId) await loadProfile(studentId);
  }, [api, guarded, loadData, loadProfile, profile]);

  return {
    analytics,
    api,
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
  };
}
