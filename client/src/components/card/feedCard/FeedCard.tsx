import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../../../common/profile/Profile';
import {
  Container,
  Feed,
  ContentContainer,
  Wrap,
  UserName,
  Context,
  More,
} from './FeedCard.styled';

interface Prop {
  memberid: number;
  username: string;
  context: string;
  url: string;
}

export default function FeedCard({ memberid, username, context, url }: Prop) {
  const navigate = useNavigate();
  const [isMore, setIsMore] = useState(false);

  return (
    <Container>
      <Feed onClick={() => setIsMore(false)} />

      <ContentContainer>
        <Wrap onClick={() => navigate(`/users/${memberid}`)}>
          <Profile size="sm" isgreen="false" url={url} />
          <UserName>{username}</UserName>
        </Wrap>

        {!isMore && (
          <Wrap>
            <Context ismore="false">{context.slice(0, 15)}</Context>
            <More onClick={() => setIsMore(true)}>더보기</More>
          </Wrap>
        )}

        {isMore && (
          <Wrap>
            <Context ismore="true">{context}</Context>
          </Wrap>
        )}
      </ContentContainer>
    </Container>
  );
}
