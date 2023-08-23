import { InfiniteData } from '@tanstack/react-query';
import { Feed } from '@/types/feedTypes';

export type HomeProp = {
  refValue: (node?: Element | null | undefined) => void;
  data: InfiniteData<Feed[]> | undefined;
  setIsGuestOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsToastOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
