import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useReadLocalStorage } from 'usehooks-ts';
import { postSubscribe } from '../../api/mutationfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { SubScribeButton } from './subscribe.styled.tsx';

interface Prop {
  guestFollow: boolean | undefined;
  usersId: string | undefined;
}

export default function Subscribe({ guestFollow, usersId }: Prop) {
  // query 갱신하기
  const queryClient = useQueryClient();

  // 구독 갱신
  const accessToken = useReadLocalStorage('accessToken');
  const subscribeMutation = useMutation({
    mutationFn: postSubscribe,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['followList'],
      });
      queryClient.invalidateQueries({
        queryKey: ['userPage', usersId],
      });
    },
  });
  const handleSubscribe = () => {
    subscribeMutation.mutate({
      url: `${SERVER_URL}/members/following/${usersId}`,
      accessToken: accessToken as string,
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
