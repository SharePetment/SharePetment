import { useMatch, useNavigate } from 'react-router-dom';
import LoginPets from '../../assets/illustration/loginpet.png';
import { ErrorText, HomeBtn } from '../../pages/notFound/NotFound.styled.tsx';

export default function NoticeOnlyOwner() {
  const navigate = useNavigate();
  const matchMypage = useMatch('/my-page');

  return (
    <div className="flex flex-col items-center justify-center">
      <ErrorText>견주만 접근가능합니다.</ErrorText>
      {matchMypage !== null && <ErrorText>반려 동물을 등록해주세요.</ErrorText>}
      {matchMypage === null && <ErrorText>반려동물 등록하러 갈까요?</ErrorText>}
      <img src={LoginPets} className=" w-80" />
      {matchMypage === null && (
        <HomeBtn onClick={() => navigate('/my-page')}>
          반려동물 등록하러가기
        </HomeBtn>
      )}
    </div>
  );
}
