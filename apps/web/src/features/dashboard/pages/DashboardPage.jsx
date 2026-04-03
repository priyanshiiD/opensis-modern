import Layout from "../../../shared/components/Layout";
import StatsGrid from "../components/StatsGrid";
import ActivityFeed from "../components/ActivityFeed";

const DashboardPage = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <StatsGrid />

      <ActivityFeed />
    </Layout>
  );
};

export default DashboardPage;