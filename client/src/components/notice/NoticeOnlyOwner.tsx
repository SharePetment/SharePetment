import { useMatch, useNavigate } from 'react-router-dom';
import LoginPets from '@/assets/illustration/loginpet.png';
import * as SC from '@/pages/notFound/NotFound.styled.tsx';
import Path from '@/routers/paths.ts';

export default function NoticeOnlyOwner() {
  const navigate = useNavigate();
  const matchMypage = useMatch(Path.MyPage);

  return (
    <div className="flex flex-col items-center justify-center">
      <SC.ErrorText>견주만 접근가능합니다.</SC.ErrorText>
      {matchMypage !== null && (
        <SC.ErrorText>반려 동물을 등록해주세요.</SC.ErrorText>
      )}
      {matchMypage === null && (
        <SC.ErrorText>반려동물 등록하러 갈까요?</SC.ErrorText>
      )}
      <img src={LoginPets} className=" w-80" />
      {matchMypage === null && (
        <SC.HomeBtn onClick={() => navigate(Path.MyPage)}>
          반려동물 등록하러가기
        </SC.HomeBtn>
      )}
    </div>
  );
}
