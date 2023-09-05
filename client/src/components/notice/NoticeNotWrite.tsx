import Cat404 from '@/assets/illustration/404cat.png';
import Cat404WebP from '@/assets/illustration/404cat.webp';
import * as SC from '@/pages/notFound/NotFound.styled.tsx';

export default function NoticeNotWrite() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SC.ErrorText>아직 게시물을 등록하지 않았어요.</SC.ErrorText>
      <picture>
        <source srcSet={Cat404WebP} type="image/webp" />
        <img src={Cat404} className=" w-80" alt="LyingDownDog" />
      </picture>
    </div>
  );
}
