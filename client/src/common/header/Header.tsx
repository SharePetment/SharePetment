// import { ReactComponent as Github } from '../../assets/github.svg';
// import { ReactComponent as Notion } from '../../assets/notion.svg';
// import { Container, TopContainer, Text } from './Header.styled';

// export default function Footer() {
//   return (
//     <Container>
//       <TopContainer>
//         <div className="flex items-center">
//           <Notion />
//           <a href="https://www.notion.so/codestates/18-e6a765fcd5f84d6ba6ef261cd16a69cd">
//             <Text>노션</Text>
//           </a>
//         </div>

//         <div className="flex items-center">
//           <Github />
//           <a href="https://github.com/codestates-seb/seb44_main_018">
//             <Text>깃허브</Text>
//           </a>
//         </div>

//         <div className="pt-[3px] flex gap-2">
//           <Text>개인정보처리방침</Text>
//           <Text>약관</Text>
//           <Text>연락처</Text>
//         </div>
//       </TopContainer>
//       <Text>@2023 Petgram from 색도18</Text>
//     </Container>
//   );
// }
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Paw } from '../../assets/paw.svg';
import Path from '../../routers/paths';
import Button from '../button/Button';
import Profile from '../profile/Profile';
import { HeaderContainer, NavList } from './Header.styled';

interface HeaderProps {
  isloginuser: string;
}

export default function Header({ isloginuser }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      {isloginuser === 'true' ? (
        <HeaderContainer>
          <div>
            <Link to={Path.Home}>
              <Paw />
            </Link>
          </div>
          <nav>
            <NavList
              onClick={e => {
                console.log(e);
              }}>
              <li>
                <Link to={Path.Home}>홈</Link>
              </li>
              <li>
                <Link to={Path.WalkMate}>산책</Link>
              </li>
              <li>
                <Link to={Path.FeedPosting}>포스트</Link>
              </li>
              <li>
                <Link to={Path.MyPage}>
                  <Profile
                    size="md"
                    url="https://huchu.link/MZFVNjh"
                    isgreen="true"
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
              <Paw />
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
