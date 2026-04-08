import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { apiBaseUrl } from "../../../shared/config/env";

function TeacherTable({ onEdit, refreshKey }) {
  const { getAccessToken } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(teacher) {
    if (!window.confirm(`Delete ${teacher.fullName}? This cannot be undone.`)) return;

    const token = getAccessToken();
    setDeletingId(teacher._id);

    try {
      const res = await fetch(`${apiBaseUrl}/api/teachers/${teacher._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Failed to delete teacher.");
        return;
      }

      setTeachers((prev) => prev.filter((t) => t._id !== teacher._id));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    async function fetchTeachers() {
      setIsLoading(true);
      setError("");

      const token = getAccessToken();
      if (!token) {
        setError("Not authenticated.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json.error?.message || "Failed to load teachers.");
          return;
        }

        setTeachers(json.data.teachers);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeachers();
  }, [refreshKey]);

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading teachers...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded">
        {error}
      </div>
    );
  }

  if (teachers.length === 0) {
    return <p className="text-gray-500 text-sm">No teachers found. Add one to get started.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-gray-600 font-medium">Name</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Email</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Phone</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Gender</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Status</th>
            <th className="px-4 py-3 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{teacher.fullName}</td>
              <td className="px-4 py-3 text-gray-600">{teacher.email}</td>
              <td className="px-4 py-3 text-gray-600">{teacher.phone || "—"}</td>
              <td className="px-4 py-3 text-gray-600 capitalize">{teacher.gender || "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    teacher.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {teacher.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-3">
                <button
                  onClick={() => onEdit(teacher)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(teacher)}
                  disabled={deletingId === teacher._id}
                  className="text-red-500 hover:underline text-sm disabled:opacity-50"
                >
                  {deletingId === teacher._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherTable;
