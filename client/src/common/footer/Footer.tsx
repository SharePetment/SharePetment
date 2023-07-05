import { ReactComponent as Github } from '../../assets/github.svg';
import { ReactComponent as Notion } from '../../assets/notion.svg';
import { Container, TopContainer, Text } from './footer.styled';

export default function Footer() {
  return (
    <Container>
      <TopContainer>
        <div className="flex items-center">
          <Notion />
          <a href="https://www.notion.so/codestates/18-e6a765fcd5f84d6ba6ef261cd16a69cd">
            <Text>노션</Text>
          </a>
        </div>

        <div className="flex items-center">
          <Github />
          <a href="https://github.com/codestates-seb/seb44_main_018">
            <Text>깃허브</Text>
          </a>
        </div>

        <div className="pt-[3px] flex gap-2">
          <Text>개인정보처리방침</Text>
          <Text>약관</Text>
          <Text>연락처</Text>
        </div>
      </TopContainer>
      <Text>@2023 Petgram from 색도18</Text>
    </Container>
  );
}
