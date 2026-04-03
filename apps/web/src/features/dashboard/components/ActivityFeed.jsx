import { activities } from "../data/dashboardData";

const ActivityFeed = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

      <div className="space-y-3">
        {activities.map((item) => (
          <div key={item.id} className="border-b pb-2">
            <p className="text-sm text-gray-800">{item.text}</p>
            <span className="text-xs text-gray-500">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;