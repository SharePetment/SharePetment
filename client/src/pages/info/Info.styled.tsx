import tw from 'tailwind-styled-components';

export const InfoForm = tw.form`
  flex
  flex-col
  items-center
  gap-7
`;

export const ConfirmButton = tw.button`
  px-4
  py-3
  bg-deepgreen
  text-white
  text-sm
  rounded-2xl
  absolute
  top-[33px]
  right-[6px]

  hover:bg-white
  hover:text-deepgreen
`;

export const DuplicateNotice = tw.div`
  text-[#FF7B7B]
  text-sm
`;

export const ExtraInfoLogo = tw.div`
  ml-8 
  mt-3 
  max-sm:w-80 
  max-sm:mx-auto 
  max-sm:justify-center 
  flex 
  items-center 
`;
