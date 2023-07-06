import { useState, useCallback } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactComponent as Close } from '../../../assets/button/close.svg';
import { ReactComponent as Plus } from '../../../assets/button/plus.svg';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import Popup from '../../../common/popup/Popup';
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
  const [savedFile, setSavedFiled] = useState<string[]>([]);

  const imgFile = new FormData();

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let files: File[] | undefined;
    if (e.target.files) {
      if (e.target.files.length >= 4) {
        setIsOpen(true);
        files = Array.from(e.target.files);
        files = files.slice(0, 3);
      } else if (savedFile.length + e.target.files.length >= 4) {
        setIsOpen(true);
        const maximum = 3 - savedFile.length;
        files = Array.from(e.target.files);
        files = files.slice(0, maximum);
      } else {
        files = Array.from(e.target.files);
      }

      const readAndPreview = (file: File) => {
        if (/\.(jpe?g|png)$/i.test(file.name)) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          return new Promise<void>(resolve => {
            reader.onload = () => {
              setSavedFiled(prev => [...prev, reader.result as string]); // 파일의 컨텐츠
              resolve();
            };
          });
        }
      };
      if (files) {
        [].forEach.call(files, readAndPreview);
      }
    }
  }, []);

  const handleSemiClose = (order: number) => {
    let copy = savedFile;
    copy = copy.filter((file, idx) => idx !== order);
    setSavedFiled(copy);
  };

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
    </>
  );
}
