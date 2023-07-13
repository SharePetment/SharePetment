import { useNavigate } from 'react-router-dom';
import LyingDownDog from '../../assets/illustration/lying-down-dog.png';
import { ErrorText, HomeBtn } from '../../pages/notFound/NotFound.style';

export default function NoticeNoData() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center">
      <ErrorText>작성한 피드가 없으시군요! 게시물 등록하러 가볼까요?</ErrorText>
      <img src={LyingDownDog} className=" w-80" />
      <HomeBtn onClick={() => navigate('/feed-posting')}>
        게시물 생성하러가기
      </HomeBtn>
    </div>
  );
}
