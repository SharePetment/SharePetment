import { useMutation } from '@tanstack/react-query';
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useReadLocalStorage } from 'usehooks-ts';
import { feedPosting } from '../../../api/mutationfn';
import { SERVER_URL } from '../../../api/url';
import { ReactComponent as Close } from '../../../assets/button/close.svg';
import { ReactComponent as Plus } from '../../../assets/button/plus.svg';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import Popup from '../../../common/popup/Popup';
import { parseImg, deleteImg } from '../../../util/parseImg';
import LoadingComponent from '../../loading/LoadingComponent';
import {
  Container,
  Wrap,
  Title,
  Pluslabel,
  Form,
  Textarea,
  SubmitBtn,
} from './FeedWriteCard.styled';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../../common/carousel/carousel.css';

export default function FeedWriteCard() {
  const navigate = useNavigate();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [savedFile, setSavedFile] = useState<string[]>([]);
  const [prevFile, setPrevFile] = useState<File[]>([]);
  /* ----------------------------- useLocalStorage ---------------------------- */
  const accessToken = useReadLocalStorage<string>('accessToken');
  const memberId = useReadLocalStorage<string>('memberId');

  const { mutate, isLoading } = useMutation({
    mutationFn: feedPosting,
    onSuccess: () => {
      navigate('/my-page');
    },
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('memberId', memberId as string);
    formData.append('content', textRef.current?.value as string);
    prevFile.forEach(file => formData.append('images', file));
    const data = {
      url: `${SERVER_URL}feeds`,
      accessToken,
      formData,
    };
    mutate(data);
  };

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      parseImg({ e, setIsOpen, setSavedFile, savedFile, setPrevFile });
    },
    [savedFile],
  );

  const handleSemiClose = useCallback(
    (order: number) =>
      deleteImg({ order, savedFile, setSavedFile, setPrevFile, prevFile }),
    [savedFile, prevFile],
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      {isOpen && (
        <Popup
          title="게시물은 최대 3개만 첨부할 수 있습니다."
          handler={[() => setIsOpen(false)]}
          btnsize={['md']}
          countbtn={1}
          buttontext={['확인']}
          isgreen={['true']}
          popupcontrol={() => setIsOpen(false)}
        />
      )}

      <div className="w-screen h-screen bg-zinc-900/70  absolute flex items-center justify-center">
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
