import SpinSVG from '@/components/spin/SpinSVG';

export default function Spin() {
  return (
    <button
      role="status"
      className="flex bg-deepgreen justify-center items-center py-2 px-4 rounded-lg">
      <SpinSVG />
      <span className=" text-white font-semibold">Loading...</span>
    </button>
  );
}
