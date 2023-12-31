import { ChangeEvent, useState, useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import Button from '../../../common/button/Button.tsx';
import Popup from '../../../common/popup/Popup.tsx';
import Profile from '../../../common/profile/Profile.tsx';
import Spin from '../../spin/Spin.tsx';
import * as SC from './petProfile.styled';
import AlertText from '@/common/popup/AlertText.ts';
import 'cropperjs/dist/cropper.css';
import { handleCropperData, handlePetImage } from '@/util/petImage.ts';

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
    handlePetImage({ setImage, setIsError, setIsViewImageCropper, e });
  };
  // cropper 함수
  const cropperRef = useRef<ReactCropperElement>(null);

  // cropa 실패
  const handleCancle = () => {
    setImage(baseImage);
    setIsViewImageCropper(false);
  };

  return (
    <>
      <SC.PetProfileDiv>
        <SC.ProfileHeader>
          <Profile isgreen="false" size="md" url={image} />
          <SC.ProfileText>
            반려동물 이미지를
            <br /> 사용해주세요!
          </SC.ProfileText>
        </SC.ProfileHeader>
        <SC.ProfileTail>
          <input
            type="file"
            accept="image/*"
            id="petImage"
            onChange={handleProfile}
            className="hidden"
          />
          <SC.Label htmlFor="petImage">프로필 등록</SC.Label>
        </SC.ProfileTail>
      </SC.PetProfileDiv>
      {isViewImageCropper && (
        <SC.CropDiv>
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
            <SC.ButtonBox>
              <Button
                text="선택"
                isgreen="true"
                handler={() =>
                  handleCropperData({
                    cropperRef,
                    setFile,
                    setImage,
                    setIsError,
                    setIsLoading,
                    setIsViewImageCropper,
                  })
                }
                size="sm"
              />
              <Button
                text="취소"
                isgreen="false"
                handler={handleCancle}
                size="sm"
              />
            </SC.ButtonBox>
          )}
          {isLoading && <Spin></Spin>}
        </SC.CropDiv>
      )}
      {isError && (
        <Popup
          title={AlertText.Failed}
          handler={[
            () => {
              setIsError(false);
            },
          ]}
          popupcontrol={() => setIsError(false)}
        />
      )}
    </>
  );
}
