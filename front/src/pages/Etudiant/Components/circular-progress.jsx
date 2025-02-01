const CircularProgress = ({ progress }) => {
    const radius = 18;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
  
    return (
      <svg className="" width="40" height="40">
        <circle
          stroke="#edf2f7"
          fill="transparent"
          strokeWidth="4"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: 0 }}
          r={radius}
          cx="20"
          cy="20"
        />
        <circle
          stroke="#4c51bf"
          fill="transparent"
          strokeWidth="4"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          r={radius}
          cx="20"
          cy="20"
        />
        <text x="50%" y="50%" dy=".3em" textAnchor="middle" className='' fontSize="10">
          {`${progress}%`}
        </text>
      </svg>
    );
  };
  
export default CircularProgress;