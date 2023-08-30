import { useMatch, Link } from 'react-router-dom';
import * as SC from './Footer.styled.tsx';
import { ReactComponent as Github } from '@/assets/github.svg';
import { ReactComponent as Notion } from '@/assets/notion.svg';
import Path from '@/routers/paths.ts';

export default function Footer() {
  const matchLogin = useMatch(Path.Login);
  return (
    <SC.Container className={matchLogin === null ? 'mb-12' : ''}>
      <SC.TopContainer>
        <div className="flex items-center">
          <Notion />
          <Link to="https://www.notion.so/codestates/18-e6a765fcd5f84d6ba6ef261cd16a69cd">
            <SC.Text>노션</SC.Text>
          </Link>
        </div>

        <div className="flex items-center">
          <Github />
          <Link to="https://github.com/codestates-seb/seb44_main_018">
            <SC.Text>깃허브</SC.Text>
          </Link>
        </div>

        <div className="pt-[3px] flex gap-2">
          <SC.Text>개인정보처리방침</SC.Text>
          <SC.Text>약관</SC.Text>
          <SC.Text>연락처</SC.Text>
        </div>
      </SC.TopContainer>
      <SC.Text>@{new Date().getFullYear()} Share Petment</SC.Text>
    </SC.Container>
  );
}
