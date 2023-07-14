type CircleProgressBarProp = {
  index: number;
};
export default function CircleProgressBar({ index }: CircleProgressBarProp) {
  if (index === 0) {
    return (
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-black" />
        <div className="w-2 h-2 rounded-full bg-lightgray" />
        <div className="w-2 h-2 rounded-full bg-lightgray" />
      </div>
    );
  } else if (index === 1) {
    return (
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-lightgray" />
        <div className="w-2 h-2 rounded-full bg-black" />
        <div className="w-2 h-2 rounded-full bg-lightgray" />
      </div>
    );
  } else if (index === 3) {
    return (
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-lightgray" />
        <div className="w-2 h-2 rounded-full bg-lightgray" />
        <div className="w-2 h-2 rounded-full bg-black" />
      </div>
    );
  }
}
