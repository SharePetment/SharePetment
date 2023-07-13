import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { patchFeedLike } from '../../../api/mutationfn';
import { SERVER_URL } from '../../../api/url';
import { ReactComponent as Comment } from '../../../assets/button/comment.svg';
import { ReactComponent as Delete } from '../../../assets/button/delete.svg';
import { ReactComponent as Edit } from '../../../assets/button/edit.svg';
import { ReactComponent as Like } from '../../../assets/button/like.svg';
import { ReactComponent as Share } from '../../../assets/button/share.svg';
import { BooleanStr } from '../../../types/propType';
import { Container, Wrap, Text } from './SideNav.styled';

interface Prop {
  feedid: number;
  direction: 'row' | 'col';
  inperson: BooleanStr;
  likes: number;
  like: BooleanStr;
  deletehandler: () => void;
  guesthandler: () => void;
}

export default function SideNav({
  feedid,
  direction,
  inperson,
  likes,
  like,
  deletehandler,
  guesthandler,
}: Prop) {
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const memberId = useReadLocalStorage<string | null>('memberId');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: patchFeedLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guestFeed'] }),
  });

  const handleClickLike = () => {
    if (!accessToken) return guesthandler();
    const data = {
      url: `${SERVER_URL}feeds/like/${feedid}/${memberId}`,
      accessToken,
    };
    likeMutation.mutate(data);
  };

  const handleClickComment = () => {
    if (!accessToken) return guesthandler();
    navigate(`/home/${feedid}`);
  };

  return (
    <>
      <Container direction={direction}>
        <Wrap className="pl-2">
          {like === 'true' ? (
            <Like className="cursor-pointer" stroke="black" fill="#69B783" />
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
          <Comment className="cursor-pointer ml-2" />
        </Wrap>

        <Wrap>
          <Share className="cursor-pointer ml-2" />
        </Wrap>

        {inperson === 'true' && (
          <>
            <Wrap onClick={() => navigate(`/feed-posting/${feedid}`)}>
              <Edit className="cursor-pointer ml-2" />
            </Wrap>
            <Wrap>
              <Delete
                className="cursor-pointer ml-2"
                onClick={() => {
                  deletehandler();
                  localStorage.setItem('feedId', String(feedid));
                }}
              />
            </Wrap>
          </>
        )}
      </Container>
    </>
  );
}
