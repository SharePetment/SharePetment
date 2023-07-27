import { useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import LoginPets from '../../assets/illustration/loginpet.png';
import { ReactComponent as Kakao } from '../../assets/kakao.svg';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import Footer from '../../common/footer/Footer.tsx';
import { Container, LoginBtn, LoginText, GuestText } from './Login.styled.tsx';

export default function Login() {
  const navigate = useNavigate();
  const accessToken = useReadLocalStorage('accessToken');

  const [firstVisited, setFirstVisited] = useLocalStorage<boolean | null>(
    'firstVisited',
    true,
  );

  useEffect(() => {
    if (!firstVisited) {
      setFirstVisited(false);
      return;
    } else if (firstVisited) {
      setFirstVisited(true);
    }
  }, [firstVisited, setFirstVisited]);

  if (accessToken) {
    return <Navigate to="/home" />;
  }

  return (
    <Container>
      <Logo width="400" className="max-sm:w-80" />
      <img src={LoginPets} width="500" />
      <Link to="https://kauth.kakao.com/oauth/authorize?client_id=07df97c2858e60b2e19f630c2c397b31&redirect_uri=http://43.202.86.53:8080/auth/kakao/callback&response_type=code">
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
