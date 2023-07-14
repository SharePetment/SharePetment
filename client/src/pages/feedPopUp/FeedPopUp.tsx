import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import tw from 'tailwind-styled-components';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import FeedCard from '../../components/card/feedcard/FeedCard';
import SideNav from '../../components/card/sidenav/SideNav';
import LoadingComponent from '../../components/loading/LoadingComponent';

const Container = tw.div`
  fixed
  top-0
  right-0
  w-screen
  h-screen
  flex
  justify-center
  items-center
  z-40
  bg-zinc-900/75
  z-50
`;

const FeedContainer = tw.div`
  w-[48rem]
  h-[560px]
  bg-defaultbg
  flex
  p-2
  rounded-3xl
  drop-shadow-xl
`;

const RightBox = tw.div`
  w-96
  h-96
  bg-blue-400
`;

export function Component() {
  const accessToken = useReadLocalStorage('accessToken');
  const { feedId } = useParams();
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['feedPopUp'],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/feeds/${feedId}`,
        accessToken as string,
      ),
  });
  console.log(data);

  if (isLoading) return <LoadingComponent />;
  if (isSuccess)
    return (
      <Container>
        <FeedContainer>
          <FeedCard
            memberid={data.memberInfo.memberId}
            username={data.memberInfo.nickname}
            context={data.content}
            userimg={data.memberInfo.imageURL}
            images={data.images}
          />

          <RightBox>
            <SideNav
              feedid={data.feedId}
              direction="row"
              likes={data.likes}
              like={data.isLike ? 'true' : 'false'}
              url={data.shareURL}
            />
          </RightBox>
        </FeedContainer>
      </Container>
    );
}

Component.displayName = 'FeedPopUp';
