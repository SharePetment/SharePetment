import { useState } from 'react';
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
  username: string;
  context: string;
  userimg: string;
}

export default function FeedCard({ username, context }: Prop) {
  const [isMore, setIsMore] = useState(false);

  return (
    <Container>
      <Feed onClick={() => setIsMore(false)} />

      <ContentContainer>
        <Wrap>
          <Profile size="sm" isgreen="false" />
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
