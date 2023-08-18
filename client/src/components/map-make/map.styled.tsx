import tw from 'tailwind-styled-components';

export const Wrapper = tw.div`
flex flex-col items-center mb-1
`;

export const SearchWrapper = tw.div`
relative
`;

export const SearchButton = tw.button`
font-semibold border border-[#d9d9d9] px-3 py-1 rounded-xl bg-deepgreen text-[#ffffff] absolute right-2 top-[12px] text-sm
`;

export const MapWrapper = tw.div`
flex  mt-3 justify-between gap-5 max-sm:w-80 max-sm:flex-co
`;

export const SearchListBox = tw.div`
h-[400px]
`;

export const Map = tw.div`
h-[350px] w-[350px] max-sm:w-[300px]
`;

export const SearchTitle = tw.p`
mb-3
`;

export const SearchKeyword = tw.span`
font-semibold
`;

export const SearchList = tw.div`
o-scrollbar w-100 h-[300px] overflow-y-scroll max-sm:w-[300px]
`;

export const SearchUl = tw.ul`
flex flex-col
`;
