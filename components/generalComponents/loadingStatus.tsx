import React from "react";

type LoadingStatusProps = {
  loading: string;
};

const LoadingStatus: React.FC<LoadingStatusProps> = ({ loading }) => {
  return (
    <div className="flex items-center justify-center">
      {loading == 'ready'  ? (
        <div className="w-6 h-6 border-4 border-text border-t-transparent rounded-full animate-spin" />
      ) : loading == 'done' ? (
        <div className="text-green-600 text-xl font-bold">✔</div>
      )
        : (
          <div className="w-6 h-6 border-4 border-text border-t-transparent rounded-full animate-spin" />
        )
    }
    </div>
  );
};

export default LoadingStatus;
