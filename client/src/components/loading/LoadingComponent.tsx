import LoadingDog from '../../assets/illustration/loading-dog.png';
import { ReactComponent as LoadingText } from '../../assets/loading-text.svg';
import { ReactComponent as Loading } from '../../assets/loading.svg';
import { Container } from './loadingComponent.styled.tsx';
export default function LoadingComponent() {
  return (
    <Container>
      <div className="relative pt-10">
        <Loading className="absolute bottom-44 right-24 " />
        <img src={LoadingDog} width={250} />
      </div>
      <LoadingText width={200} height={50} />
    </Container>
  );
}
