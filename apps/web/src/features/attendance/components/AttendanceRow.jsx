const AttendanceRow = ({ index, student, onToggle }) => {
  const isPresent = student.status === "Present";

  return (
    <tr>
      <td className="text-gray-400 w-10">{index}</td>
      <td className="font-medium">{student.studentName}</td>
      <td>{student.className}</td>
      <td>
        <button
          onClick={() => onToggle(student._id)}
          className={`badge cursor-pointer transition-colors ${
            isPresent ? "badge-success" : "badge-danger"
          }`}
        >
          {isPresent ? "✓ Present" : "✗ Absent"}
        </button>
      </td>
    </tr>
  );
};

export default AttendanceRow;