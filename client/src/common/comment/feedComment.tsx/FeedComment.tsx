import Profile from '../../profile/Profile';
import {
  Container,
  UserBox,
  UserId,
  Time,
  Content,
} from './FeedComment.styled';

interface Prop {
  memberid: number;
  nickname: string;
  userimg: string;
  content: string;
}

export default function FeedComment({
  // memberid,
  nickname,
  userimg,
  content,
}: Prop) {
  return (
    <Container>
      <UserBox>
        <Profile size="sm" isgreen="false" url={userimg} />
        <UserId>{nickname}</UserId>
        <Time>몇시간전</Time>
      </UserBox>
      <Content>{content}</Content>
    </Container>
  );
}
