import { useState, useEffect } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { createClass, updateClass } from "../api/classesApi";

// cls prop = edit mode, null = add mode
// onSuccess called after successful save
// onCancel called when user clicks Cancel
function ClassForm({
  cls = null,
  onSuccess,
  onCancel,
  teachers = [],
  loadingTeachers = false,
  teachersError = "",
}) {
  const { getAccessToken } = useAuth();
  const isEditMode = !!cls;

  const emptyForm = {
    classId: "",
    name: "",
    gradeLevel: "",
    section: "",
    teacherId: "",
    academicYear: "",
    capacity: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (cls) {
      setFormData({
        classId: cls.classId ?? "",
        name: cls.name || "",
        gradeLevel: cls.gradeLevel || "",
        section: cls.section || "",
        teacherId: cls.teacherId || "",
        academicYear: cls.academicYear || "",
        capacity: cls.capacity || "",
        status: cls.status || "Active",
      });
    } else {
      setFormData(emptyForm);
    }
    setError("");
  }, [cls]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!isEditMode && !formData.classId.trim()) {
      setError("Class ID is required.");
      return;
    }
    if (!formData.name.trim()) {
      setError("Class name is required.");
      return;
    }
    if (!formData.gradeLevel) {
      setError("Grade level is required.");
      return;
    }
    if (!formData.section.trim()) {
      setError("Section is required.");
      return;
    }
    if (!formData.teacherId) {
      setError("Teacher is required.");
      return;
    }
    if (!formData.academicYear.trim()) {
      setError("Academic year is required.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = isEditMode
        ? {
            name: formData.name.trim(),
            gradeLevel: parseInt(formData.gradeLevel),
            section: formData.section.trim(),
            teacherId: parseInt(formData.teacherId),
            academicYear: formData.academicYear.trim(),
            capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
            status: formData.status,
          }
        : {
            classId: parseInt(formData.classId),
            name: formData.name.trim(),
            gradeLevel: parseInt(formData.gradeLevel),
            section: formData.section.trim(),
            teacherId: parseInt(formData.teacherId),
            academicYear: formData.academicYear.trim(),
            capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
            status: formData.status,
          };

      if (isEditMode) {
        await updateClass(token, cls.classId, body);
      } else {
        await createClass(token, body);
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message || "Failed to save class.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const gradeOptions = [
    { value: 1, label: "Grade 1" },
    { value: 2, label: "Grade 2" },
    { value: 3, label: "Grade 3" },
    { value: 4, label: "Grade 4" },
    { value: 5, label: "Grade 5" },
    { value: 6, label: "Grade 6" },
    { value: 7, label: "Grade 7" },
    { value: 8, label: "Grade 8" },
    { value: 9, label: "Grade 9" },
    { value: 10, label: "Grade 10" },
    { value: 11, label: "Grade 11" },
    { value: 12, label: "Grade 12" },
  ];

  return (
    <div className="bg-white p-6 rounded border border-gray-300">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {isEditMode ? "Edit Class" : "Create New Class"}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Class ID (disabled in edit mode) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class ID *
            </label>
            <input
              type="number"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              disabled={isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., 1001"
            />
          </div>

          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="e.g., 10-A Science"
            />
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level *
            </label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select grade</option>
              {gradeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section *
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="e.g., A"
            />
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher *
            </label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              disabled={loadingTeachers || teachers.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">
                {loadingTeachers
                  ? "Loading teachers..."
                  : teachers.length === 0
                  ? "No teachers available"
                  : "Select teacher"}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.firstName} {teacher.lastName} ({teacher.subject || "—"})
                </option>
              ))}
            </select>
            {teachersError && (
              <p className="mt-1 text-xs text-red-600">{teachersError}</p>
            )}
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year *
            </label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="e.g., 2025-26"
              pattern="^\d{4}-\d{2}$"
              title="Enter academic year in YYYY-YY format, e.g. 2025-26"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use format YYYY-YY, for example 2025-26.
            </p>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (optional)
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="e.g., 50"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update Class" : "Create Class"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClassForm;
