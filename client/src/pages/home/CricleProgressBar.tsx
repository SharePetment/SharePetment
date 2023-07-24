type CircleProgressBarProp = {
  circle: {
    index: number;
    total: number;
  };
};
export default function CircleProgressBar({ circle }: CircleProgressBarProp) {
  const { index, total } = circle;

  return (
    <div className="flex gap-2">
      {Array(total)
        .fill(undefined)
        .map((_, idx) => {
          return idx === index ? (
            <div key={idx} className="w-2 h-2 rounded-full bg-black" />
          ) : (
            <div key={idx} className="w-2 h-2 rounded-full bg-lightgray" />
          );
        })}
    </div>
  );
}
