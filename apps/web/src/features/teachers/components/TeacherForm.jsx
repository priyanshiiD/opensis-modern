import { useState, useEffect } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import {
  createTeacher,
  updateTeacher,
} from "../api/teacherApi";

// teacher prop = edit mode, null = add mode
// onSuccess called after successful save
// onCancel called when user clicks Cancel
function TeacherForm({ teacher = null, onSuccess, onCancel }) {
  const { getAccessToken } = useAuth();
  const isEditMode = !!teacher;

  const emptyForm = {
    teacherId: "",
    firstName: "",
    lastName: "",
    department: "",
    subject: "",
    phone: "",
    gender: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (teacher) {
      setFormData({
        teacherId: teacher.teacherId ?? "",
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        department: teacher.department || "",
        subject: teacher.subject || "",
        phone: teacher.phone || "",
        gender: teacher.gender || "",
        status: teacher.status || "Active",
      });
    } else {
      setFormData(emptyForm);
    }
    setError("");
  }, [teacher]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isEditMode && !formData.teacherId) {
      setError("Teacher ID is required.");
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (isEditMode) {
        result = await updateTeacher(teacher.teacherId, formData, token);
      } else {
        result = await createTeacher(formData, token);
      }

      if (onSuccess) onSuccess(result);
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-2 rounded">
          {error}
        </div>
      )}

      {!isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            placeholder="Unique numeric ID"
            min="1"
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter first name"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter last name"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="e.g. Mathematics"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g. Algebra"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit phone number"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="unspecified">Unspecified</option>
        </select>
      </div>

      {isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Update Teacher" : "Add Teacher"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TeacherForm;
