import { useState } from "react";
import Layout from "../../../shared/components/Layout";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";

// view: "list" | "add" | "edit"
function StudentsPage() {
  const [view, setView] = useState("list");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAddClick() {
    setSelectedStudent(null);
    setView("add");
  }

  function handleEditClick(student) {
    setSelectedStudent(student);
    setView("edit");
  }

  function handleSuccess() {
    setView("list");
    setSelectedStudent(null);
    setRefreshKey((k) => k + 1); // triggers table to re-fetch
  }

  function handleCancel() {
    setView("list");
    setSelectedStudent(null);
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          {view === "list" && (
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              + Add Student
            </button>
          )}
        </div>

        {/* List view */}
        {view === "list" && (
          <StudentTable onEdit={handleEditClick} refreshKey={refreshKey} />
        )}

        {/* Add view */}
        {view === "add" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Student</h2>
            <StudentForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        )}

        {/* Edit view */}
        {view === "edit" && selectedStudent && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Student</h2>
            <StudentForm
              student={selectedStudent}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default StudentsPage;