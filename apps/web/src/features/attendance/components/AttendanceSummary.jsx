const AttendanceSummary = ({ students }) => {
  if (students.length === 0) return null;

  const total = students.length;
  const present = students.filter((s) => s.status === "Present").length;
  const absent = total - present;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="grid-3">
      <div className="card border-l-4 border-green-500">
        <p className="text-sm text-gray-500 mb-1">Present</p>
        <p className="text-2xl font-bold text-green-600">{present}</p>
      </div>

      <div className="card border-l-4 border-red-500">
        <p className="text-sm text-gray-500 mb-1">Absent</p>
        <p className="text-2xl font-bold text-red-600">{absent}</p>
      </div>

      <div className="card border-l-4 border-blue-500">
        <p className="text-sm text-gray-500 mb-1">Attendance Rate</p>
        <p className="text-2xl font-bold text-blue-600">{pct}%</p>
        <p className="text-xs text-gray-400 mt-1">{present} / {total} students</p>
      </div>
    </div>
  );
};

export default AttendanceSummary;