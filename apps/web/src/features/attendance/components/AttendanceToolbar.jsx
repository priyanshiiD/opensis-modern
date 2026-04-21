const AttendanceToolbar = ({
  date,
  setDate,
  className,
  setClassName,
  onMarkAllPresent,
  onMarkAllAbsent,
  onSave,
  loading,
  disabled,
}) => {
  return (
    <div className="card">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Date picker */}
        <div>
          <label htmlFor="att-date" className="label">Date</label>
          <input
            id="att-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Class selector */}
        <div>
          <label htmlFor="att-class" className="label">Class</label>
          <select
            id="att-class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="input-field"
          >
            <option value="10A">10A</option>
            <option value="9B">9B</option>
            <option value="8C">8C</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 items-end pt-5">
          <button
            onClick={onMarkAllPresent}
            disabled={disabled}
            className="btn btn-success btn-sm disabled:opacity-50"
          >
            ✓ All Present
          </button>

          <button
            onClick={onMarkAllAbsent}
            disabled={disabled}
            className="btn btn-danger btn-sm disabled:opacity-50"
          >
            ✗ All Absent
          </button>

          <button
            onClick={onSave}
            disabled={disabled || loading}
            className="btn btn-primary btn-sm disabled:opacity-50"
          >
            {loading ? "Saving…" : "💾 Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceToolbar;