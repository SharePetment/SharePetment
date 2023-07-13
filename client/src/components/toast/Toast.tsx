import { ReactComponent as Star } from '../../assets/button/star.svg';
import { Container, Text } from './Toast.styled';

export default function Toast() {
  return (
    <Container>
      <Star />
      <Text>링크가 복사되었습니다.</Text>
    </Container>
  );
}
