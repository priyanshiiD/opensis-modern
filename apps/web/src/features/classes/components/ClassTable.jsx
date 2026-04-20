import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { fetchClasses, deleteClass } from "../api/classesApi";

function ClassTable({ onEdit, refreshKey, teachers = [] }) {
  const { getAccessToken } = useAuth();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Helper to find teacher name by teacherId
  function getTeacherName(teacherId) {
    const teacher = teachers.find((t) => t.teacherId === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown";
  }

  async function handleDelete(cls) {
    if (!window.confirm(`Deactivate class "${cls.name}"? This cannot be undone.`)) return;

    const token = getAccessToken();
    setDeletingId(cls.classId);

    try {
      const deletedClass = await deleteClass(token, cls.classId);
      setClasses((prev) =>
        prev.map((c) =>
          c.classId === cls.classId
            ? { ...c, ...(deletedClass || {}), status: (deletedClass && deletedClass.status) || "Inactive" }
            : c
        )
      );
    } catch (err) {
      setError(err.message || "Failed to delete class.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    async function loadClasses() {
      setIsLoading(true);
      setError("");

      const token = getAccessToken();
      if (!token) {
        setError("Not authenticated.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchClasses(token);
        setClasses(data.classes || []);
      } catch (err) {
        setError(err.message || "Failed to load classes.");
      } finally {
        setIsLoading(false);
      }
    }

    loadClasses();
  }, [refreshKey]);

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading classes...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded">
        {error}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded">
        No classes found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Class ID</th>
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Name</th>
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Grade</th>
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Section</th>
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Teacher</th>
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Year</th>
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Capacity</th>
            <th className="text-left px-4 py-2 font-semibold text-gray-700">Status</th>
            <th className="text-center px-4 py-2 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.classId} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-900">{cls.classId}</td>
              <td className="px-4 py-2 text-gray-900">{cls.name}</td>
              <td className="px-4 py-2 text-gray-600">{cls.gradeLevel}</td>
              <td className="px-4 py-2 text-gray-600">{cls.section}</td>
              <td className="px-4 py-2 text-gray-600">{getTeacherName(cls.teacherId)}</td>
              <td className="px-4 py-2 text-gray-600">{cls.academicYear}</td>
              <td className="px-4 py-2 text-gray-600">{cls.capacity || "—"}</td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    cls.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {cls.status}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onEdit(cls)}
                  className="text-blue-600 hover:text-blue-800 text-xs mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls)}
                  disabled={deletingId === cls.classId}
                  className="text-red-600 hover:text-red-800 text-xs disabled:opacity-50"
                >
                  {deletingId === cls.classId ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassTable;
