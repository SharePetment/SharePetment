import { InfiniteData } from '@tanstack/react-query';
import * as SC from '@/components/home-page/re-btn/reButton.styled';
import { Feed } from '@/types/feedTypes';

type Prop = {
  data: InfiniteData<Feed[]> | undefined;
};

export default function ReButton({ data }: Prop) {
  return (
    <>
      {data && data.pages[data.pages.length - 1].length === 0 && (
        <SC.ReBtn
          className={window.innerWidth < 430 ? 'bottom-[80px]' : 'bottom-10'}
          onClick={() => {
            window.location.reload();
          }}>
          피드 다시 받아오기
        </SC.ReBtn>
      )}
    </>
  );
}
