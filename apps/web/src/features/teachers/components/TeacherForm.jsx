import { useState, useEffect } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { apiBaseUrl } from "../../../shared/config/env";

// teacher prop = edit mode, null = add mode
// onSuccess called after successful save
// onCancel called when user clicks Cancel
function TeacherForm({ teacher = null, onSuccess, onCancel }) {
  const { getAccessToken } = useAuth();
  const isEditMode = !!teacher;

  const emptyForm = {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    profilePic: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (teacher) {
      setFormData({
        fullName: teacher.fullName || "",
        email: teacher.email || "",
        password: "", // password not editable via this endpoint
        phone: teacher.phone || "",
        gender: teacher.gender || "",
        profilePic: teacher.profilePic || "",
        isActive: teacher.isActive ?? true,
      });
    } else {
      setFormData(emptyForm);
    }
    setError("");
  }, [teacher]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Full name and email are required.");
      return;
    }
    if (!isEditMode && !formData.password.trim()) {
      setError("Password is required.");
      return;
    }
    if (!isEditMode && formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEditMode
        ? `${apiBaseUrl}/api/teachers/${teacher._id}`
        : `${apiBaseUrl}/api/teachers`;

      const method = isEditMode ? "PUT" : "POST";

      // password is not sent on edit (backend blocks it)
      const body = isEditMode
        ? { fullName: formData.fullName, email: formData.email, phone: formData.phone, gender: formData.gender, profilePic: formData.profilePic, isActive: formData.isActive }
        : { fullName: formData.fullName, email: formData.email, password: formData.password, phone: formData.phone, gender: formData.gender, profilePic: formData.profilePic };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message || "Something went wrong.");
        return;
      }

      if (onSuccess) onSuccess(json.data.teacher);
    } catch (err) {
      setError("Network error. Please try again.");
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

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
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile Picture URL
        </label>
        <input
          type="text"
          name="profilePic"
          value={formData.profilePic}
          onChange={handleChange}
          placeholder="https://..."
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isEditMode && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active
          </label>
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
