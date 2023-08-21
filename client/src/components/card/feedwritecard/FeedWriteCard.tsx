import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Close } from '@/assets/button/close.svg';
import { ReactComponent as Plus } from '@/assets/button/plus.svg';
import { ReactComponent as Write } from '@/assets/button/write.svg';
import AlertText from '@/common/popup/AlertText';
import Popup from '@/common/popup/Popup.tsx';
import {
  Container,
  Wrap,
  Title,
  Pluslabel,
  Form,
  Textarea,
  SubmitBtn,
} from '@/components/card/feedwritecard/FeedWriteCard.styled.tsx';
import LoadingComponent from '@/components/loading/LoadingComponent.tsx';
import NoticeServerError from '@/components/notice/NoticeServerError.tsx';
import usePatchFormMutation from '@/hook/api/mutation/usePatchFormMutation';
import usePostFormMutation from '@/hook/api/mutation/usePostFormMutation';
import useFeedDetailQuery from '@/hook/api/query/useFeedDetailQuery';
import useHandleFeedCardUpload from '@/hook/useHandleFeedCardUpload';
import useHandleKeyBoard from '@/hook/useHandleKeyBoard';
import Path from '@/routers/paths.ts';
import { FeedImage } from '@/types/feedTypes.ts';
import { parseImg, deleteImg } from '@/util/parseImg.ts';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/common/carousel/carousel.css';

export default function FeedWriteCard() {
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
  useHandleKeyBoard({ navigate });

  // param이 있을 경우,  피드 게시물 정보 가져오기
  const getFeedDetailQuery = useFeedDetailQuery({
    feedId: Number(feedId),
    url: `${SERVER_URL}/feeds/${feedId}`,
    accessToken,
    firstFn: setSavedFile,
    secondFn: setPrevFile,
    booleanFn: setGetQuery,
    textRef,
    firstEnable: savedFile,
    secondEnable: getQuery,
  });

  const feedPostingMutation = usePostFormMutation({
    key: ['myFeed', 'myPage', 'followList'],
    successFn: () => navigate(Path.MyPage),
    errorFn: () => setIsOpen([true, AlertText.Failed]),
  });

  // 피드 게시물 수정하기 mutation
  const feedEditingMutation = usePatchFormMutation({
    key: ['feedPopUp'],
    successFn: () => navigate(Path.MyPage),
    errorFn: () => setIsOpen([true, AlertText.Failed]),
  });

  // submit event에서 실행할 함수 생성하기
  const handleSubmit = useHandleFeedCardUpload({
    prevFile,
    removedFile,
    accessToken: accessToken as string,
    textRef,
    setIsOpen,
    feedId,
  });

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
  }

  return (
    <>
      {isOpen[0] && (
        <Popup
          title={isOpen[1]}
          handler={[() => setIsOpen([false, ''])]}
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
