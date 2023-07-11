import { useMutation } from '@tanstack/react-query';
import { postSubscribe } from '../../api/mutationfn';
import { SubScribeButton } from './subscribe.styled';

interface Prop {
  guestFollow: boolean | undefined;
  usersId: string | number | undefined;
  memberId: string | number | null;
  setIsSubscribed: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function Subscribe({
  guestFollow,
  usersId,
  memberId,
  setIsSubscribed,
}: Prop) {
  const subscribeMutation = useMutation({
    mutationFn: postSubscribe,
    onSuccess(data) {
      setIsSubscribed(data.follow);
    },
    onError(error) {
      console.log(error);
    },
  });
  const handleSubscribe = () => {
    subscribeMutation.mutate(`${usersId}/${memberId}`);
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
