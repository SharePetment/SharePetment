import { useNavigate, Link } from 'react-router-dom';
import LoginPets from '../../assets/illustration/loginpet.png';
import { ReactComponent as Kakao } from '../../assets/kakao.svg';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import Footer from '../../common/footer/Footer';
import { Container, LoginBtn, LoginText, GuestText } from './Login.styled';

export default function Login() {
  const navigate = useNavigate();

  return (
    <Container>
      <Logo width="400" className="max-sm:w-80" />
      <img src={LoginPets} width="500" />
      <Link to="/">
        <LoginBtn>
          <Kakao />
          <LoginText>Log in With KaKao</LoginText>
        </LoginBtn>
      </Link>
      <GuestText onClick={() => navigate('/home')}>Guest로 시작하기</GuestText>
      <Footer />
    </Container>
  );
}
