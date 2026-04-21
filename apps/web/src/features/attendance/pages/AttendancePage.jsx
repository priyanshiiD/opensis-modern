import { useEffect, useState, useCallback } from "react";
import Layout from "../../../shared/components/Layout";
import AttendanceToolbar from "../components/AttendanceToolbar";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceSummary from "../components/AttendanceSummary";
import { fetchAttendance, saveAttendance } from "../api/attendanceApi";

const today = () => new Date().toISOString().slice(0, 10);

const AttendancePage = () => {
  const [date, setDate] = useState(today);
  const [className, setClassName] = useState("10A");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  // ── Fetch attendance whenever date or class changes ──
  const loadData = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setError(null);
    setSaveMsg(null);

    try {
      const data = await fetchAttendance(date, className);
      setStudents(data || []);
    } catch (err) {
      setError(err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [date, className]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Bulk toggles ──
  const markAllPresent = () =>
    setStudents((prev) => prev.map((s) => ({ ...s, status: "Present" })));

  const markAllAbsent = () =>
    setStudents((prev) => prev.map((s) => ({ ...s, status: "Absent" })));

  // ── Save ──
  const handleSave = async () => {
    if (students.length === 0) return;
    setSaving(true);
    setError(null);
    setSaveMsg(null);

    try {
      await saveAttendance(date, students);
      setSaveMsg("Attendance saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {saveMsg && (
          <div className="alert alert-success" role="alert">
            {saveMsg}
          </div>
        )}

        <AttendanceToolbar
          date={date}
          setDate={setDate}
          className={className}
          setClassName={setClassName}
          onMarkAllPresent={markAllPresent}
          onMarkAllAbsent={markAllAbsent}
          onSave={handleSave}
          loading={saving}
          disabled={loading || students.length === 0}
        />

        <AttendanceTable
          students={students}
          setStudents={setStudents}
          loading={loading}
        />

        <AttendanceSummary students={students} />
      </div>
    </Layout>
  );
};

export default AttendancePage;