import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url.ts';
import { SubScribeButton } from '@/components/subscribe/subscribe.styled.tsx';
import useSubscribeMutation from '@/hook/api/mutation/useSubscribeMutation';

interface Prop {
  guestFollow: boolean | undefined;
  usersId: string | undefined;
}

export default function Subscribe({ guestFollow, usersId }: Prop) {
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  // 구독 mutation
  const subscribeMutation = useSubscribeMutation({
    keys: [['followList'], ['userPage', usersId as string]],
  });

  const handleSubscribe = () => {
    subscribeMutation.mutate({
      url: `${SERVER_URL}/members/following/${usersId}`,
      accessToken,
    });
  };

  return (
    <>
      {guestFollow ? (
        <SubScribeButton onClick={handleSubscribe}>구독해지</SubScribeButton>
      ) : (
        <SubScribeButton onClick={handleSubscribe}>구독하기</SubScribeButton>
      )}
    </>
  );
}
