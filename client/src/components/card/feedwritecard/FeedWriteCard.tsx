import { useState, useCallback } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactComponent as Close } from '../../../assets/button/close.svg';
import { ReactComponent as Plus } from '../../../assets/button/plus.svg';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import Popup from '../../../common/popup/Popup';
import { parseImg, deleteImg } from '../../../util/parseImg';
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
import './carousel.css';

export default function FeedWriteCard() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [savedFile, setSavedFile] = useState<string[]>([]);

  // const imgFile = new FormData();

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      parseImg({ e, setIsOpen, setSavedFile, savedFile });
    },
    [savedFile],
  );

  const handleSemiClose = useCallback(
    (order: number) => deleteImg({ order, savedFile, setSavedFile }),
    [savedFile],
  );

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
          <Close className="absolute right-6 top-6" fill="black" />
          <Wrap>
            <Title>게시물 작성</Title>
          </Wrap>

          <Swiper
            pagination={{
              type: 'fraction',
            }}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper">
            {savedFile.map((file, idx) => (
              <SwiperSlide key={idx}>
                <img src={file} />
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

          <Textarea placeholder="글을 입력해주세요." maxLength={200} />
          <SubmitBtn type="submit">
            <Write />
          </SubmitBtn>
        </Container>
      </div>
    </>
  );
}
