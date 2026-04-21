import { useState, useEffect } from "react";
import Layout from "../../../shared/components/Layout";
import ClassTable from "../components/ClassTable";
import ClassForm from "../components/ClassForm";
import { useAuth } from "../../auth/context/AuthContext";
import { fetchTeachers } from "../../teachers/api/teacherApi";

// view: "list" | "add" | "edit"
function ClassesPage() {
  const { getAccessToken } = useAuth();
  const [view, setView] = useState("list");
  const [selectedClass, setSelectedClass] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [teachersError, setTeachersError] = useState("");

  // Load teachers for dropdown
  useEffect(() => {
    async function loadTeachers() {
      setTeachersError("");
      const token = getAccessToken();
      if (!token) {
        setLoadingTeachers(false);
        return;
      }

      try {
        const data = await fetchTeachers(token);
        setTeachers(data);
      } catch (err) {
        setTeachersError(err.message || "Failed to load teachers.");
      } finally {
        setLoadingTeachers(false);
      }
    }

    loadTeachers();
  }, []);

  function handleAddClick() {
    setSelectedClass(null);
    setView("add");
  }

  function handleEditClick(cls) {
    setSelectedClass(cls);
    setView("edit");
  }

  function handleSuccess() {
    setView("list");
    setSelectedClass(null);
    setRefreshKey((k) => k + 1); // triggers table to re-fetch
  }

  function handleCancel() {
    setView("list");
    setSelectedClass(null);
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
          {view === "list" && (
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              + Add Class
            </button>
          )}
        </div>

        {/* List view */}
        {view === "list" && (
          <ClassTable onEdit={handleEditClick} refreshKey={refreshKey} teachers={teachers} />
        )}

        {/* Add/Edit view */}
        {(view === "add" || view === "edit") && (
          <ClassForm
            cls={selectedClass}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            teachers={teachers}
            loadingTeachers={loadingTeachers}
            teachersError={teachersError}
          />
        )}
      </div>
    </Layout>
  );
}

export default ClassesPage;
