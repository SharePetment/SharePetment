import Cat404 from '../../assets/illustration/404cat.png';
import { ErrorText } from '../../pages/notFound/NotFound.styled.tsx';

export default function NoticeNotWrite() {
  return (
    <div className="flex flex-col items-center justify-center">
      <ErrorText>아직 게시물을 등록하지 않았어요.</ErrorText>
      <img src={Cat404} className=" w-80" />
    </div>
  );
}
