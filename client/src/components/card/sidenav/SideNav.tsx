import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { patchFeedLike } from '../../../api/mutationfn.ts';
import { SERVER_URL } from '../../../api/url.ts';
import { ReactComponent as Comment } from '../../../assets/button/comment.svg';
import { ReactComponent as Delete } from '../../../assets/button/delete.svg';
import { ReactComponent as Edit } from '../../../assets/button/edit.svg';
import { ReactComponent as Like } from '../../../assets/button/like.svg';
import { ReactComponent as Share } from '../../../assets/button/share.svg';
import { BooleanStr } from '../../../types/propType.ts';
import { Container, Wrap, Text } from './SideNav.styled.tsx';

interface Prop {
  feedid: number;
  direction: 'row' | 'col';
  likes: number;
  like: BooleanStr;
  guesthandler?: () => void;
  deletehandler?: React.Dispatch<React.SetStateAction<boolean>>;
  inperson?: BooleanStr;
  commenthandler?: React.Dispatch<React.SetStateAction<boolean>>;
  modalhandler?: React.Dispatch<React.SetStateAction<[boolean, string]>>;
  toasthandler?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideNav({
  feedid,
  direction,
  likes,
  like,
  guesthandler,
  toasthandler,
  deletehandler,
  inperson,
  commenthandler,
  modalhandler,
}: Prop) {
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const feedPopUp = useMatch('/home/:feedId');
  const [isLike, setIsLike] = useState<BooleanStr>(like);
  const [isLikes, setIsLikes] = useState<number>(likes);

  const likeMutation = useMutation({
    mutationFn: patchFeedLike,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['feedPopUp'] });
      setIsLike(data.isLike.toString());
      setIsLikes(data.likeCount);
    },
    onError: () => {
      if (modalhandler) modalhandler([true, '요청에 실패했어요.']);
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

  const handleClickShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://sharepetment.site/home/${feedid}`,
      );
      if (toasthandler) {
        toasthandler(true);
        setTimeout(() => toasthandler(false), 1500);
      }
    } catch (err) {
      if (modalhandler) modalhandler([true, '요청에 실패했어요.']);
    }
  };

  const handleClickComment = () => {
    if (!accessToken) {
      if (guesthandler) return guesthandler();
    }
    navigate(`/home/${feedid}`);
  };

  const handleClickSemiComment = () => {
    if (commenthandler) commenthandler(true);
  };

  return (
    <>
      <Container direction={direction}>
        <Wrap className="pl-2">
          {isLike === 'true' && accessToken ? (
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

          <Text>{isLikes}</Text>
        </Wrap>

        {!feedPopUp && (
          <Wrap onClick={handleClickComment}>
            <Comment className="cursor-pointer ml-2" stroke="black" />
          </Wrap>
        )}

        {feedPopUp && window.innerWidth < 420 && (
          <Wrap onClick={handleClickSemiComment}>
            <Comment className="cursor-pointer ml-2" stroke="black" />
          </Wrap>
        )}

        <Wrap onClick={handleClickShare}>
          <Share className="cursor-pointer ml-2" stroke="none" />
        </Wrap>

        {inperson === 'true' && (
          <>
            <Wrap
              onClick={() => navigate(`/feed-posting/${feedid}`)}
              className="cursor-pointer ml-2">
              <Edit stroke="black" />
            </Wrap>
            <Wrap
              className="cursor-pointer ml-2"
              onClick={() => {
                if (deletehandler) return deletehandler(true);
              }}>
              <Delete stroke="black" />
            </Wrap>
          </>
        )}
      </Container>
    </>
  );
}
