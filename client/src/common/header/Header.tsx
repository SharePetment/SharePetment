import { useState } from 'react';
import { useMatch, Link, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import AlertText from '../popup/AlertText';
import NavItem from './NavItem';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import Button from '@/common/button/Button.tsx';
import * as SC from '@/common/header/Header.styled';
import Popup from '@/common/popup/Popup.tsx';
import Profile from '@/common/profile/Profile.tsx';
import useMypageQuery from '@/hook/api/query/useMypageQuery';
import Path from '@/routers/paths.ts';

export default function Header() {
  const matchMypage = useMatch(Path.MyPage);
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data, isSuccess } = useMypageQuery({
    url: `${SERVER_URL}/members`,
    accessToken,
  });

  const handleClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate(Path.Login);
  };

  if (accessToken && isSuccess) {
    return (
      <>
        {isOpen && (
          <Popup
            title={AlertText.Pet}
            handler={[
              () => {
                setIsOpen(false);
                navigate(Path.MyPage);
              },
            ]}
            buttontext={['펫 등록하러가기']}
            popupcontrol={() => setIsOpen(false)}
          />
        )}
        <SC.HeaderContainer>
          <div>
            <Link to={Path.Home}>
              <Logo className="w-52 h-8" />
            </Link>
          </div>
          <nav>
            <SC.NavList>
              <NavItem path="Home" />
              {data?.animalParents && <NavItem path="Walk" />}
              {!data?.animalParents && (
                <NavItem path="NoWalk" handler={() => setIsOpen(true)} />
              )}
              <NavItem path="Post" />
              <li>
                <Link to={Path.MyPage}>
                  <Profile
                    size="md"
                    url={data && data.memberInfo.imageURL}
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
            </SC.NavList>
          </nav>
        </SC.HeaderContainer>
      </>
    );
  } else {
    return (
      <>
        {isOpen && (
          <Popup
            title={AlertText.Login}
            handler={[
              () => {
                setIsOpen(false);
                navigate(Path.Login);
              },
            ]}
            buttontext={['로그인하러가기']}
            popupcontrol={() => setIsOpen(false)}
          />
        )}
        <SC.HeaderContainer>
          <div>
            <Link to={Path.Home}>
              <Logo className="w-52 h-8" />
            </Link>
          </div>
          <nav>
            <SC.NavList>
              <NavItem path="Home" />
              <NavItem path="NoWalk" />
              <NavItem path="NoPost" handler={() => setIsOpen(true)} />
              <li>
                <Button
                  size="sm"
                  text="로그인"
                  isgreen="true"
                  handler={handleClick}
                />
              </li>
            </SC.NavList>
          </nav>
        </SC.HeaderContainer>
      </>
    );
  }
}
