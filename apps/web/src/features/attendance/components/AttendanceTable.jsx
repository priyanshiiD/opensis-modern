import AttendanceRow from "./AttendanceRow";

const AttendanceTable = ({ students, setStudents, loading }) => {
  const toggleStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, status: s.status === "Present" ? "Absent" : "Present" }
          : s
      )
    );
  };

  if (loading) {
    return (
      <div className="card text-center py-12 text-gray-400">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p>Loading attendance…</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">📋</p>
        <p className="font-medium">No attendance records</p>
        <p className="text-sm">Select a date and class to load data.</p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <AttendanceRow
              key={student._id}
              index={index + 1}
              student={student}
              onToggle={toggleStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;