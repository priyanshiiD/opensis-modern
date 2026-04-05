import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../api/studentApi.js';
import { StudentForm } from '../components/StudentForm.jsx';
import toast from 'react-hot-toast';

export default function AddStudentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await createStudent(data);
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (error) {
      toast.error(error.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>
          <p className="text-gray-500 mt-1">Enter the details of the new student below.</p>
        </div>
        <button
          onClick={() => navigate('/students')}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
      
      <StudentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
