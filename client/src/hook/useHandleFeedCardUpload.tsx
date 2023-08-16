import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '@/api/url';
import usePatchFormMutation from '@/hook/api/mutation/usePatchFormMutation';
import usePostFormMutation from '@/hook/api/mutation/usePostFormMutation';
import Path from '@/routers/paths';
import { FeedImage } from '@/types/feedTypes';
import throttling from '@/util/throttling';

//  FeedCardUpload에 사용

type Prop = {
  prevFile: (File | FeedImage)[];
  setIsOpen: React.Dispatch<React.SetStateAction<[boolean, string]>>;
  textRef: React.RefObject<HTMLTextAreaElement>;
  feedId: string | undefined;
  accessToken: string;
  removedFile: string[];
};

const useHandleFeedCardUpload = ({
  prevFile,
  setIsOpen,
  textRef,
  feedId,
  accessToken,
  removedFile,
}: Prop) => {
  const throtll = throttling();
  const navigate = useNavigate();
  const feedPostingMutation = usePostFormMutation({
    key: ['myFeed', 'myPage', 'followList'],
    successFn: () => navigate(Path.MyPage),
    errorFn: () => setIsOpen([true, '요청에 실패했습니다.']),
  });

  // 피드 게시물 수정하기 mutation
  const feedEditingMutation = usePatchFormMutation({
    key: ['feedPopUp'],
    successFn: () => navigate(Path.MyPage),
    errorFn: () => setIsOpen([true, '요청에 실패했습니다.']),
  });

  const fn = () => {
    if (prevFile.length === 0)
      return setIsOpen([true, '사진을 업로드 해주세요.']);

    const formData = new FormData();
    formData.append('content', textRef.current?.value as string);

    if (feedId === undefined) {
      prevFile.forEach(file => formData.append('images', file as File));
      const data = {
        url: `${SERVER_URL}/feeds`,
        accessToken,
        formData,
      };
      throtll(() => {
        feedPostingMutation.mutate(data);
      });
    } else {
      prevFile.forEach(file => formData.append('addImage', file as File));
      if (removedFile.length > 0)
        removedFile.forEach(fileName =>
          formData.append('deleteImage', fileName as string),
        );
      const data = {
        url: `${SERVER_URL}/feeds/${feedId}`,
        accessToken,
        formData,
      };
      throtll(() => {
        feedEditingMutation.mutate(data);
      });
    }
  };

  return fn;
};

export default useHandleFeedCardUpload;
