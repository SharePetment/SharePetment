import imageCompression from 'browser-image-compression';
import { ChangeEvent, useState, useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import Button from '../../../common/button/Button.tsx';
import Popup from '../../../common/popup/Popup.tsx';
import Profile from '../../../common/profile/Profile.tsx';
import { option } from '../../../util/imageCompressOption.ts';
import Spin from '../../spin/Spin.tsx';
import {
  ButtonBox,
  CropDiv,
  Label,
  PetProfileDiv,
  ProfileHeader,
  ProfileTail,
  ProfileText,
} from './petProfile.styled';
import 'cropperjs/dist/cropper.css';

type Prop = {
  baseImage: string;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function PetProfile({
  image,
  setImage,
  baseImage,
  setFile,
}: Prop) {
  const [isViewImageCropper, setIsViewImageCropper] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 이미지 처리
  const handleProfile = (e: ChangeEvent<HTMLInputElement>) => {
    let file: File | undefined;
    if (e.target.files) {
      file = e.target.files[0];
      setIsViewImageCropper(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<void>(resolve => {
        reader.onload = () => {
          setImage(reader.result as string); // 파일의 컨텐츠
          resolve();
        };
        reader.onerror = () => {
          setIsError(true);
        };
      });
    }
  };
  // cropper 함수
  const cropperRef = useRef<ReactCropperElement>(null);
  // cropper 채택
  const getCropData = async () => {
    try {
      const cropper = cropperRef.current?.cropper;
      if (cropper) {
        setIsLoading(true);
        const image = cropper.getCroppedCanvas().toDataURL();
        setImage(image);
        // string을 file 형태로 변환
        const cropfile = await fetch(cropper.getCroppedCanvas().toDataURL())
          .then(res => res.blob())
          .then(async blob => {
            const file = new File([blob], 'newAvatar.jpeg', {
              type: 'image/jpeg',
            });
            const compressedFile = await imageCompression(file, option);
            return compressedFile;
          })
          .catch(() => {
            setIsError(true);
          });
        if (cropfile) {
          setFile(cropfile);
          setIsLoading(false);
        }
      }
      setIsViewImageCropper(false);
    } catch (err) {
      console.error(err);
      setIsError(true);
      setIsLoading(false);
    }
  };

  // cropa 실패
  const handleCancle = () => {
    setImage(baseImage);
    setIsViewImageCropper(false);
  };

  return (
    <>
      <PetProfileDiv>
        <ProfileHeader>
          <Profile isgreen="false" size="md" url={image} />
          <ProfileText>
            반려동물 이미지를
            <br /> 사용해주세요!
          </ProfileText>
        </ProfileHeader>
        <ProfileTail>
          <input
            type="file"
            accept="image/*"
            id="petImage"
            onChange={handleProfile}
            className="hidden"
          />
          <Label htmlFor="petImage">프로필 등록</Label>
        </ProfileTail>
      </PetProfileDiv>
      {isViewImageCropper && (
        <CropDiv>
          <Cropper
            ref={cropperRef}
            src={image}
            viewMode={1}
            background={false}
            responsive
            autoCropArea={1}
            checkOrientation={false}
            guides
            className="w-[400px] h-[400px] max-sm:w-[300px] max-sm:h-[300px]"
          />
          {!isLoading && (
            <ButtonBox>
              <Button
                text="선택"
                isgreen="true"
                handler={getCropData}
                size="sm"
              />
              <Button
                text="취소"
                isgreen="false"
                handler={handleCancle}
                size="sm"
              />
            </ButtonBox>
          )}
          {isLoading && <Spin></Spin>}
        </CropDiv>
      )}
      {isError && (
        <Popup
          title={'이미지 변환 과정에서 오류가 발생했습니다.'}
          handler={[
            () => {
              setIsError(false);
            },
          ]}
          isgreen={['true']}
          btnsize={['md']}
          buttontext={['확인']}
          countbtn={1}
          popupcontrol={() => setIsError(false)}
        />
      )}
    </>
  );
}
