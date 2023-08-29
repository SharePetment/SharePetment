import { useNavigate } from 'react-router-dom';
import LyingDownDog from '@/assets/illustration/lying-down-dog.png';
import * as SC from '@/pages/notFound/NotFound.styled.tsx';

type NoticeNoDataProp = {
  url: string;
};

export default function NoticeNoData({ url }: NoticeNoDataProp) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center">
      <SC.ErrorText>
        작성한 피드가 없으시군요! 게시물 등록하러 가볼까요?
      </SC.ErrorText>
      <img src={LyingDownDog} className="w-80 my-5" />
      <SC.HomeBtn onClick={() => navigate(`/${url}`)}>
        게시물 등록하러 가기
      </SC.HomeBtn>
    </div>
  );
}
