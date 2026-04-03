import Layout from "../../../shared/components/Layout";
import StudentTable from "../components/StudentTable";

const StudentsPage = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Students</h1>
      <StudentTable />
    </Layout>
  );
};

export default StudentsPage;