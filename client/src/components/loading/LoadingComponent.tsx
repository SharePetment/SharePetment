import LoadingDog from '@/assets/illustration/loading-dog.png';
import LoadingDogWebp from '@/assets/illustration/loading-dog.webp';
import { ReactComponent as LoadingText } from '@/assets/loading-text.svg';
import { ReactComponent as Loading } from '@/assets/loading.svg';
import * as SC from '@/components/loading/loadingComponent.styled.tsx';
export default function LoadingComponent() {
  return (
    <SC.Container>
      <SC.LoadingWrap>
        <Loading className="absolute bottom-44 right-24 " />
        <picture>
          <source srcSet={LoadingDogWebp} type="image/webp" />
          <img src={LoadingDog} className=" w-60" alt="LyingDownDog" />
        </picture>
      </SC.LoadingWrap>
      <LoadingText width={200} height={50} />
    </SC.Container>
  );
}
