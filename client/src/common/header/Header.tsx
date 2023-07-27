import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useMatch, Link, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import Path from '../../routers/paths.ts';
import Button from '../button/Button.tsx';
import Popup from '../popup/Popup.tsx';
import Profile from '../profile/Profile.tsx';
import { HeaderContainer, NavItem, NavList } from './Header.styled.tsx';

export default function Header() {
  const matchHome = useMatch('/home');
  const matchWalkmate = useMatch('/walkmate');
  const matchPost = useMatch('/feed-posting');
  const matchMypage = useMatch('/my-page');
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

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
      <>
        {isOpen && (
          <Popup
            title={'산책게시물을 보려면 펫을 등록해주세요!'}
            handler={[
              () => {
                setIsOpen(false);
                navigate('/my-page');
              },
            ]}
            isgreen={['true']}
            btnsize={['md']}
            buttontext={['펫 등록하러가기']}
            countbtn={1}
            popupcontrol={() => setIsOpen(false)}
          />
        )}
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
              {data?.animalParents && (
                <NavItem active={matchWalkmate !== null ? 'false' : 'true'}>
                  <Link to={Path.WalkMate}>산책</Link>
                </NavItem>
              )}
              {!data?.animalParents && (
                <NavItem
                  active={matchWalkmate !== null ? 'false' : 'true'}
                  className="cursor-pointer"
                  onClick={() => setIsOpen(true)}>
                  산책
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
      </>
    );
  } else {
    return (
      <>
        {isOpen && (
          <Popup
            title={'로그인을 해주세요.'}
            handler={[
              () => {
                setIsOpen(false);
                navigate('/');
              },
            ]}
            isgreen={['true']}
            btnsize={['md']}
            buttontext={['로그인하러가기']}
            countbtn={1}
            popupcontrol={() => setIsOpen(false)}
          />
        )}
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
              <NavItem
                active="true"
                className="cursor-pointer"
                onClick={() => setIsOpen(true)}>
                산책
              </NavItem>
              <NavItem
                active="true"
                className="cursor-pointer"
                onClick={() => setIsOpen(true)}>
                포스트
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
      </>
    );
  }
}
