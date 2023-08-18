import tw from 'tailwind-styled-components';

export const Wrapper = tw.div`
flex flex-col relative justify-center items-center bg-white w-full h-[320px] mb-2 rounded-md
`;
export const Address = tw.h2`
justify-self-start self-start px-2 py-1 font-semibold text-lg
`;
export const Map = tw.div`
w-[480px] h-[250px] max-sm:w-5/6
`;
export const Button = tw.button`
absolute bg-deepgreen bottom-[0px] right-[10px] z-10 rounded-lg max-sm:right-[25px] max-sm:bottom-[3px]
`;

export const KakaoHref = tw.a`
text-white flex px-2 py-1
`;
