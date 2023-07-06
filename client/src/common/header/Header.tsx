import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Like } from '../../assets/button/like.svg';
import Path from '../../routers/paths';
import Button from '../button/Button';
import Profile from '../profile/Profile';
import { HeaderContainer, NavItem, NavList } from './Header.styled';

interface HeaderProps {
  isloginuser: string;
}

export default function Header({ isloginuser }: HeaderProps) {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const selectTabHandler = (index: number) => {
    setCurrentTab(index);
  };

  const tabs = [
    { name: '홈', link: Path.Home },
    { name: '산책', link: Path.WalkMate },
    { name: '포스트', link: Path.FeedPosting },
  ];

  return (
    <>
      {isloginuser === 'true' ? (
        <HeaderContainer>
          <div>
            <Link to={Path.Home}>
              <Like className=" w-6 h-6 stroke-defaulttext" />
            </Link>
          </div>
          <nav>
            <NavList>
              {tabs.map((tab, index) => (
                <NavItem
                  key={index}
                  onClick={() => selectTabHandler(index)}
                  currenttab={currentTab}
                  idx={index}>
                  <Link to={tab.link}>{tab.name}</Link>
                </NavItem>
              ))}
              <li>
                <Link to={Path.MyPage}>
                  <Profile
                    size="md"
                    url="https://huchu.link/MZFVNjh"
                    isgreen="false"
                  />
                </Link>
              </li>
              <li>
                <Button
                  size="sm"
                  text="로그아웃"
                  isgreen="true"
                  handler={() => navigate('/')}
                />
              </li>
            </NavList>
          </nav>
        </HeaderContainer>
      ) : (
        <HeaderContainer>
          <div>
            <Link to={Path.Home}>
              <Like />
            </Link>
          </div>
          <nav>
            <NavList>
              <li>
                <Link to={Path.Home}>홈</Link>
              </li>
              <li>
                <Button
                  size="sm"
                  text="로그인"
                  isgreen="true"
                  handler={() => navigate('/')}
                />
              </li>
            </NavList>
          </nav>
        </HeaderContainer>
      )}
    </>
  );
}
