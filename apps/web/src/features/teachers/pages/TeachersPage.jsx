import { useState } from "react";
import Layout from "../../../shared/components/Layout";
import TeacherTable from "../components/TeacherTable";
import TeacherForm from "../components/TeacherForm";

// view: "list" | "add" | "edit"
function TeachersPage() {
  const [view, setView] = useState("list");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAddClick() {
    setSelectedTeacher(null);
    setView("add");
  }

  function handleEditClick(teacher) {
    setSelectedTeacher(teacher);
    setView("edit");
  }

  function handleSuccess() {
    setView("list");
    setSelectedTeacher(null);
    setRefreshKey((k) => k + 1); // triggers table to re-fetch
  }

  function handleCancel() {
    setView("list");
    setSelectedTeacher(null);
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
          {view === "list" && (
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              + Add Teacher
            </button>
          )}
        </div>

        {/* List view */}
        {view === "list" && (
          <TeacherTable onEdit={handleEditClick} refreshKey={refreshKey} />
        )}

        {/* Add view */}
        {view === "add" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Teacher</h2>
            <TeacherForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        )}

        {/* Edit view */}
        {view === "edit" && selectedTeacher && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Teacher</h2>
            <TeacherForm
              teacher={selectedTeacher}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TeachersPage;
