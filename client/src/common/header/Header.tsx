import { useMatch, Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import Path from '../../routers/paths';
import Button from '../button/Button';
import Profile from '../profile/Profile';
import { HeaderContainer, NavItem, NavList } from './Header.styled';

export default function Header() {
  const matchHome = useMatch('/home');
  const matchWalkmate = useMatch('/walkmate');
  const matchPost = useMatch('/feed-posting');
  const memberId = localStorage.getItem('memberId');
  const animalParents = localStorage.getItem('animalParents');
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('memberId');
    localStorage.removeItem('animalParents');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <HeaderContainer>
      <div>
        <Link to={Path.Home}>
          <Logo className="w-52 h-8" />
        </Link>
      </div>
      <nav>
        <NavList>
          {memberId === null && (
            <NavItem active={matchHome !== null}>
              <Link to={Path.Home}>홈</Link>
            </NavItem>
          )}
          {memberId !== null && animalParents === 'false' ? (
            <>
              <NavItem active={matchHome !== null}>
                <Link to={Path.Home}>홈</Link>
              </NavItem>
              <NavItem active={matchPost !== null}>
                <Link to={Path.FeedPosting}>포스트</Link>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem active={matchHome !== null}>
                <Link to={Path.Home}>홈</Link>
              </NavItem>
              <NavItem active={matchWalkmate !== null}>
                <Link to={Path.WalkMate}>산책</Link>
              </NavItem>
              <NavItem active={matchPost !== null}>
                <Link to={Path.FeedPosting}>포스트</Link>
              </NavItem>
            </>
          )}

          <li>
            <Link to={Path.MyPage}>
              <Profile
                size="md"
                url={
                  animalParents
                    ? 'https://cdn-icons-png.flaticon.com/512/3364/3364044.png'
                    : ''
                }
                isgreen="false"
              />
            </Link>
          </li>
          <li>
            <Button
              size="sm"
              text="로그아웃"
              isgreen="true"
              handler={handleClick}
            />
          </li>
        </NavList>
      </nav>
    </HeaderContainer>
  );
}
