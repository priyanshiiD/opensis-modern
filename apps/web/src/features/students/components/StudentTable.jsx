import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { apiBaseUrl } from "../../../shared/config/env";

function StudentTable({ onEdit, refreshKey }) {
  const { getAccessToken } = useAuth();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(student) {
    const studentName = `${student.firstName} ${student.lastName}`;
    if (!window.confirm(`Delete ${studentName}? This cannot be undone.`)) return;

    const token = getAccessToken();
    setDeletingId(student._id);

    try {
      const res = await fetch(`${apiBaseUrl}/api/students/${student._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Failed to delete student.");
        return;
      }

      setStudents((prev) => prev.filter((s) => s._id !== student._id));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    async function fetchStudents() {
      setIsLoading(true);
      setError("");

      const token = getAccessToken();
      if (!token) {
        setError("Not authenticated.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json.error?.message || "Failed to load students.");
          return;
        }

        setStudents(json.data.students);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudents();
  }, [getAccessToken, refreshKey]);

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading students...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded">
        {error}
      </div>
    );
  }

  if (students.length === 0) {
    return <p className="text-gray-500 text-sm">No students found. Add one to get started.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-gray-600 font-medium">Student ID</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Full Name</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Email</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Phone</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Class</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Gender</th>
            <th className="px-4 py-3 text-gray-600 font-medium">DOB</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Grad Date</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Status</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600 font-semibold">{student.studentId}</td>
              <td className="px-4 py-3 font-medium text-gray-800">
                <div>
                  {student.firstName} {student.middleName && `${student.middleName}`} {student.lastName}
                </div>
                {student.commonName && (
                  <div className="text-xs text-gray-500">({student.commonName})</div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">{student.email || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{student.phone || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{student.className}</td>
              <td className="px-4 py-3 text-gray-600 capitalize">{student.gender || "—"}</td>
              <td className="px-4 py-3 text-gray-600">
                {student.dob ? new Date(student.dob).toLocaleDateString("en-IN") : "—"}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {student.estimatedGradDate ? new Date(student.estimatedGradDate).toLocaleDateString("en-IN") : "—"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    student.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {student.status}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-3 whitespace-nowrap">
                <button
                  onClick={() => onEdit(student)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student)}
                  disabled={deletingId === student._id}
                  className="text-red-500 hover:underline text-sm disabled:opacity-50"
                >
                  {deletingId === student._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;