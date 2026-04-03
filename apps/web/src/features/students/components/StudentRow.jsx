const StudentRow = ({ student }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2">{student.name}</td>
      <td>{student.class}</td>
      <td>
        <span
          className={`px-2 py-1 rounded text-sm ${
            student.status === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {student.status}
        </span>
      </td>
    </tr>
  );
};

export default StudentRow;
