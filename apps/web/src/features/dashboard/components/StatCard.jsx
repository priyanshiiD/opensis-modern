const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
      
      <div
        className="w-14 h-14 flex items-center justify-center rounded-xl text-xl"
        style={{ backgroundColor: color + "20", color }}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
      </div>

    </div>
  );
};

export default StatCard;