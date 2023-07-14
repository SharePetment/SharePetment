import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { useMatch, Link, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import Path from '../../routers/paths';
import { MemberIdContext, State } from '../../store/Context';
import Button from '../button/Button';
import Profile from '../profile/Profile';
import { HeaderContainer, NavItem, NavList } from './Header.styled';
export default function Header() {
  const matchHome = useMatch('/home');
  const matchWalkmate = useMatch('/walkmate');
  const matchPost = useMatch('/feed-posting');
  const matchMypage = useMatch('/my-page');
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  console.log(accessToken);
  const navigate = useNavigate();
  // context api 반려동물 등록 여부
  const { animalParents } = useContext(MemberIdContext) as State;

  const { data, isSuccess } = useQuery({
    queryKey: ['myPage'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
    enabled: !!accessToken,
  });

  const handleClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  if (accessToken && isSuccess) {
    return (
      <HeaderContainer>
        <div>
          <Link to={Path.Home}>
            <Logo className="w-52 h-8" />
          </Link>
        </div>
        <nav>
          <NavList>
            <NavItem active={matchHome !== null ? 'false' : 'true'}>
              <Link to={Path.Home}>홈</Link>
            </NavItem>
            {animalParents && (
              <NavItem active={matchWalkmate !== null ? 'false' : 'true'}>
                <Link to={Path.WalkMate}>산책</Link>
              </NavItem>
            )}
            <NavItem active={matchPost !== null ? 'false' : 'true'}>
              <Link to={Path.FeedPosting}>포스트</Link>
            </NavItem>
            <li>
              <Link to={Path.MyPage}>
                <Profile
                  size="md"
                  url={data.memberInfo.imageURL}
                  isgreen={matchMypage !== null ? 'true' : 'false'}
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
  } else {
    return (
      <HeaderContainer>
        <div>
          <Link to={Path.Home}>
            <Logo className="w-52 h-8" />
          </Link>
        </div>
        <nav>
          <NavList>
            <NavItem active={matchHome !== null ? 'false' : 'true'}>
              <Link to={Path.Home}>홈</Link>
            </NavItem>
            <li>
              <Button
                size="sm"
                text="로그인"
                isgreen="true"
                handler={handleClick}
              />
            </li>
          </NavList>
        </nav>
      </HeaderContainer>
    );
  }
}
