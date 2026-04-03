import { students } from "../data/studentsData";
import StudentRow from "./StudentRow";

const StudentTable = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Students</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="pb-2">Name</th>
            <th className="pb-2">Class</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <StudentRow key={s.id} student={s} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;