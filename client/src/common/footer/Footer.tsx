import { useMatch, Link } from 'react-router-dom';
import { ReactComponent as Github } from '../../assets/github.svg';
import { ReactComponent as Notion } from '../../assets/notion.svg';
import { Container, TopContainer, Text } from './Footer.styled.tsx';

export default function Footer() {
  const matchLogin = useMatch('/');
  return (
    <Container className={matchLogin === null ? 'mb-12' : ''}>
      <TopContainer>
        <div className="flex items-center">
          <Notion />
          <Link to="https://www.notion.so/codestates/18-e6a765fcd5f84d6ba6ef261cd16a69cd">
            <Text>노션</Text>
          </Link>
        </div>

        <div className="flex items-center">
          <Github />
          <Link to="https://github.com/codestates-seb/seb44_main_018">
            <Text>깃허브</Text>
          </Link>
        </div>

        <div className="pt-[3px] flex gap-2">
          <Text>개인정보처리방침</Text>
          <Text>약관</Text>
          <Text>연락처</Text>
        </div>
      </TopContainer>
      <Text>@{new Date().getFullYear()} Share Petment</Text>
    </Container>
  );
}
