import { STATUS_COLORS } from "../utils/constants";

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
      {status}
    </span>
  );
};

export default StatusBadge;