import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentById, updateStudent } from '../api/studentApi.js';
import { StudentForm } from '../components/StudentForm.jsx';
import toast from 'react-hot-toast';

export default function EditStudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(id);
        setStudent(data);
      } catch (error) {
        toast.error('Failed to fetch student details');
        navigate('/students');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchStudent();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await updateStudent(id, data);
      toast.success('Student updated successfully!');
      navigate('/students');
    } catch (error) {
      toast.error(error.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Student</h1>
          <p className="text-gray-500 mt-1">Updating details for {student?.firstName} {student?.lastName}</p>
        </div>
        <button
          onClick={() => navigate('/students')}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
      
      {student && (
        <StudentForm initialData={student} onSubmit={handleSubmit} loading={loading} />
      )}
    </div>
  );
}
