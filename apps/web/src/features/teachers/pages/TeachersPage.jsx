import TeacherForm from "../components/TeacherForm";
import Layout from "../../../shared/components/Layout";

function TeachersPage() {
    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Add Teacher</h1>
                <TeacherForm />
            </div>
        </Layout>
    );
}

export default TeachersPage;