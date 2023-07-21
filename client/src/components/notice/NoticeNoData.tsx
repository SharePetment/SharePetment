import { useNavigate } from 'react-router-dom';
import LyingDownDog from '../../assets/illustration/lying-down-dog.png';
import { ErrorText, HomeBtn } from '../../pages/notFound/NotFound.styled.tsx';

type NoticeNoDataProp = {
  url: string;
};

export default function NoticeNoData({ url }: NoticeNoDataProp) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center">
      <ErrorText>작성한 피드가 없으시군요! 게시물 등록하러 가볼까요?</ErrorText>
      <img src={LyingDownDog} className="w-80 my-5" />
      <HomeBtn onClick={() => navigate(`/${url}`)}>
        게시물 등록하러 가기
      </HomeBtn>
    </div>
  );
}
