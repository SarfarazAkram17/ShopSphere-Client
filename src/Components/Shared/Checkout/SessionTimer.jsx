const SessionTimer = ({ remainingTime, formatTime }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg shadow-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl">⏱️</span>
        <div>
          <p className="text-yellow-800 font-semibold text-lg">
            Session expires in: {formatTime(remainingTime)}
          </p>
          <p className="text-yellow-700 text-sm">
            Complete your order within the time limit
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;