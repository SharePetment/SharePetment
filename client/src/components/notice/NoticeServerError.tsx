import { useNavigate } from 'react-router-dom';
import Cat404 from '../../assets/illustration/404cat.png';
import { ErrorText, HomeBtn } from '../../pages/notFound/NotFound.styled.tsx';

export default function NoticeServerError() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center">
      <ErrorText>데이터를 불러오는 과정에서 에러가 발생했습니다.</ErrorText>
      <img src={Cat404} className=" w-80" />
      <HomeBtn onClick={() => navigate('/home')}>홈으로 돌아가기</HomeBtn>
    </div>
  );
}
