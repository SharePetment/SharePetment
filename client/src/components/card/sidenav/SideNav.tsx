import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { patchFeedLike } from '../../../api/mutationfn';
import { SERVER_URL } from '../../../api/url';
import { ReactComponent as Comment } from '../../../assets/button/comment.svg';
import { ReactComponent as Like } from '../../../assets/button/like.svg';
import { ReactComponent as Share } from '../../../assets/button/share.svg';
import { BooleanStr } from '../../../types/propType';
import { Container, Wrap, Text } from './SideNav.styled';

interface Prop {
  feedid: number;
  direction: 'row' | 'col';
  likes: number;
  like: BooleanStr;
  guesthandler?: () => void;
  toasthandler?: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
}

export default function SideNav({
  feedid,
  direction,
  likes,
  like,
  guesthandler,
  toasthandler,
  url,
}: Prop) {
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: patchFeedLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostRandomFeed'] });
      queryClient.invalidateQueries({ queryKey: ['feedPopUp'] });
      queryClient.invalidateQueries({ queryKey: ['hostFeed'] });
    },
  });

  const handleClickLike = () => {
    if (!accessToken) {
      if (guesthandler) return guesthandler();
    }
    const data = {
      url: `${SERVER_URL}/feeds/like/${feedid}`,
      accessToken,
    };
    likeMutation.mutate(data);
  };

  const handleClickComment = () => {
    if (!accessToken) {
      if (guesthandler) return guesthandler();
    }
    navigate(`/home/${feedid}`);
  };

  const handleClickShare = async () => {
    await navigator.clipboard.writeText(url);
    if (toasthandler) {
      toasthandler(true);
      setTimeout(() => toasthandler(false), 1500);
    }
  };

  return (
    <>
      <Container direction={direction}>
        <Wrap className="pl-2">
          {like === 'true' ? (
            <Like
              className="cursor-pointer"
              stroke="black"
              fill="#69B783"
              onClick={handleClickLike}
            />
          ) : (
            <Like
              className="cursor-pointer "
              stroke="black"
              onClick={handleClickLike}
            />
          )}

          <Text>{likes}</Text>
        </Wrap>

        <Wrap onClick={handleClickComment}>
          <Comment className="cursor-pointer ml-2" stroke="black" />
        </Wrap>

        <Wrap onClick={handleClickShare}>
          <Share className="cursor-pointer ml-2" />
        </Wrap>
      </Container>
    </>
  );
}
