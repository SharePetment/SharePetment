import LoadingDog from '@/assets/illustration/loading-dog.png';
import { ReactComponent as LoadingText } from '@/assets/loading-text.svg';
import { ReactComponent as Loading } from '@/assets/loading.svg';
import * as SC from '@/components/loading/loadingComponent.styled.tsx';
export default function LoadingComponent() {
  return (
    <SC.Container>
      <SC.LoadingWrap>
        <Loading className="absolute bottom-44 right-24 " />
        <img src={LoadingDog} width={250} />
      </SC.LoadingWrap>
      <LoadingText width={200} height={50} />
    </SC.Container>
  );
}
