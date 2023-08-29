import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import * as SC from './SideNav.styled.tsx';
import { patchMutation } from '@/api/mutationfn.ts';
import { SERVER_URL } from '@/api/url.ts';
import SideNavWrap from '@/components/card/sidenav/SideNavWrap.tsx';
import Path from '@/routers/paths.ts';
import { BooleanStr } from '@/types/propType.ts';

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
  const feedPopUp = useMatch(Path.FeedPopUp);
  const [isLike, setIsLike] = useState<BooleanStr>(like);
  const [isLikes, setIsLikes] = useState<number>(likes);

  const likeMutation = useMutation({
    mutationFn: patchMutation,
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

  // 링크 복사
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
    navigate(`${Path.Home}/${feedid}`);
  };

  const handleClickSemiComment = () => {
    if (commenthandler) commenthandler(true);
  };

  return (
    <>
      <SC.Container direction={direction}>
        <SideNavWrap class="pl-2">
          <SideNavWrap.Like
            onClick={handleClickLike}
            isLike={isLike}
            accessToken={accessToken}
          />
          <SC.Text>{isLikes}</SC.Text>
        </SideNavWrap>

        {
          <SideNavWrap
            onClick={
              !feedPopUp
                ? handleClickComment
                : feedPopUp && window.innerWidth < 420
                ? handleClickSemiComment
                : undefined
            }>
            <SideNavWrap.Comment />
          </SideNavWrap>
        }

        <SideNavWrap onClick={handleClickShare}>
          <SideNavWrap.Share />
        </SideNavWrap>

        {inperson === 'true' && (
          <>
            <SideNavWrap
              class="cursor-pointer ml-2"
              onClick={() => navigate(`${Path.FeedPosting}/${feedid}`)}>
              <SideNavWrap.Edit />
            </SideNavWrap>
            <SideNavWrap
              class="cursor-pointer ml-2"
              onClick={() => {
                if (deletehandler) return deletehandler(true);
              }}>
              <SideNavWrap.Delete />
            </SideNavWrap>
          </>
        )}
      </SC.Container>
    </>
  );
}
