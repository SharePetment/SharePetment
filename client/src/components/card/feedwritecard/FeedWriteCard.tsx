import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useReadLocalStorage } from 'usehooks-ts';
import { patchFeed, postFeed } from '../../../api/mutationfn.ts';
import { getServerDataWithJwt } from '../../../api/queryfn.ts';
import { SERVER_URL } from '../../../api/url.ts';
import { ReactComponent as Close } from '../../../assets/button/close.svg';
import { ReactComponent as Plus } from '../../../assets/button/plus.svg';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import Popup from '../../../common/popup/Popup.tsx';
import { FeedImage, Feed } from '../../../types/feedTypes.ts';
import { parseImg, deleteImg } from '../../../util/parseImg.ts';
import LoadingComponent from '../../loading/LoadingComponent.tsx';
import NoticeServerError from '../../notice/NoticeServerError.tsx';
import {
  Container,
  Wrap,
  Title,
  Pluslabel,
  Form,
  Textarea,
  SubmitBtn,
} from './FeedWriteCard.styled.tsx';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../../common/carousel/carousel.css';

export default function FeedWriteCard() {
  const queryClient = useQueryClient();
  const { feedId } = useParams();
  const navigate = useNavigate();
  const textRef = useRef<HTMLTextAreaElement>(null);

  // 모달 state
  const [isOpen, setIsOpen] = useState<[boolean, string]>([false, '']);

  // file 저장 state
  const [removedFile, setRemovedFile] = useState<string[]>([]);
  const [savedFile, setSavedFile] = useState<string[]>([]);
  const [prevFile, setPrevFile] = useState<(File | FeedImage)[]>([]);

  // param있을 시, query 불러온 여부
  const [getQuery, setGetQuery] = useState<boolean>(false);

  /* ----------------------------- useLocalStorage ---------------------------- */
  const accessToken = useReadLocalStorage<string>('accessToken');

  // esc 누를 시, 창닫기
  useEffect(() => {
    const getBackPage = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', getBackPage);
    return () => window.removeEventListener('keydown', getBackPage);
  }, [navigate]);

  // param이 있을 경우,  피드 게시물 정보 가져오기

  const getFeedDetailQuery = useQuery<Feed>({
    queryKey: ['feedPopUp', Number(feedId)],
    queryFn: async () => {
      const result = await getServerDataWithJwt(
        `${SERVER_URL}/feeds/${feedId}`,
        accessToken as string,
      );
      result.images.map((image: FeedImage) => {
        setSavedFile(prev => [...prev, image.uploadFileURL]);
        setPrevFile(prev => [...prev, image]);
        setGetQuery(true);
      });

      if (textRef.current) {
        textRef.current.value = result.content;
      }
      return result;
    },
    enabled: !!feedId && savedFile.length === 0 && !getQuery,
  });

  // 피드 게시물 올리기 mutation
  const feedPostingMutation = useMutation({
    mutationFn: postFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPage'] });
      queryClient.invalidateQueries({ queryKey: ['myFeed'] });
      queryClient.invalidateQueries({ queryKey: ['followList'] });
      navigate('/my-page');
    },
    onError: () => setIsOpen([true, '요청에 실패했습니다.']),
  });

  // 피드 게시물 수정하기 mutation
  const feedEditingMutation = useMutation({
    mutationFn: patchFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedPopUp'] });
      navigate(`/my-page`);
    },
    onError: () => setIsOpen([true, '요청에 실패했습니다.']),
  });

  const handleSubmit = () => {
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
      feedPostingMutation.mutate(data);
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
      feedEditingMutation.mutate(data);
    }
  };

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      parseImg({ e, setIsOpen, setSavedFile, savedFile, setPrevFile });
    },
    [savedFile],
  );

  const handleSemiClose = useCallback(
    (order: number) =>
      deleteImg({
        order,
        savedFile,
        setSavedFile,
        setPrevFile,
        prevFile,
        setRemovedFile,
      }),
    [savedFile, prevFile],
  );

  if (getFeedDetailQuery.isError || !accessToken)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <NoticeServerError />
      </div>
    );
  if (
    getFeedDetailQuery.isFetching &&
    feedPostingMutation.isLoading &&
    feedEditingMutation.isLoading
  ) {
    return <LoadingComponent />;
  } else
    return (
      <>
        {isOpen[0] && (
          <Popup
            title={isOpen[1]}
            handler={[() => setIsOpen([false, ''])]}
            btnsize={['md']}
            countbtn={1}
            buttontext={['확인']}
            isgreen={['true']}
            popupcontrol={() => setIsOpen([false, ''])}
          />
        )}
        <div
          className="w-screen h-screen bg-zinc-900/75  absolute flex items-center justify-center max-sm:items-start max-sm:pt-10"
          onClick={e => {
            if (e.target === e.currentTarget) navigate(-1);
          }}>
          <Container>
            <Close
              className="absolute right-6 top-6 cursor-pointer"
              fill="black"
              onClick={() => navigate(-1)}
            />
            <Wrap>
              <Title>게시물 작성</Title>
            </Wrap>

            <Swiper
              pagination={{
                type: 'fraction',
              }}
              navigation={true}
              modules={[Navigation]}
              className="w-80 h-[360px] rounded-lg">
              {savedFile.map((file, idx) => (
                <SwiperSlide
                  key={idx}
                  className="bg-lightgray flex justify-center items-center relative rounded-lg">
                  <img
                    src={file}
                    className="rounded-lg border border-lightgray"
                  />
                  <Close
                    className="absolute top-3 right-3 cursor-pointer"
                    fill="#a1a1aa"
                    onClick={() => handleSemiClose(idx)}
                  />
                </SwiperSlide>
              ))}

              {savedFile.length < 3 && (
                <SwiperSlide>
                  <Form>
                    <Pluslabel htmlFor="feedimg">
                      <Plus className="w-full mt-[180px]" />
                    </Pluslabel>
                    <input
                      id="feedimg"
                      type="file"
                      accept="image/*"
                      onChange={e => handleUpload(e)}
                      style={{ display: 'none' }}
                      multiple
                    />
                  </Form>
                </SwiperSlide>
              )}
            </Swiper>

            <Textarea
              placeholder="글을 입력해주세요."
              maxLength={200}
              ref={textRef}
            />
            <SubmitBtn type="button" onClick={handleSubmit}>
              <Write />
            </SubmitBtn>
          </Container>
        </div>
      </>
    );
}
