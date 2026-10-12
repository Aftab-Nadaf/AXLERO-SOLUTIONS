interface ProgressBarProps {
  progress: number;
  max:number; // 0 to 100
}

export function ProgressBar({ progress,max }: ProgressBarProps) {
  return (
    <div className="w-full grid progressbar">
      <div className="text-xs -ml-2">{progress}/{max}</div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700 mt-1">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;