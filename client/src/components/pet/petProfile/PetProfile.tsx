import { ChangeEvent, useState, useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import Button from '../../../common/button/Button';
import Profile from '../../../common/profile/Profile';
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
      });
    }
  };
  // cropper 함수
  const cropperRef = useRef<ReactCropperElement>(null);
  // cropper 채택
  const getCropData = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const image = cropper.getCroppedCanvas().toDataURL();
      setImage(image);
      // string을 file 형태로 변환
      const cropfile = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then(res => res.blob())
        .then(blob => {
          return new File([blob], 'newAvatar.png', { type: 'image/png' });
        });
      setFile(cropfile);
    }
    setIsViewImageCropper(false);
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
          <ProfileText>반려동물만이 포함된 이미지를 사용해주세요!</ProfileText>
        </ProfileHeader>
        <ProfileTail>
          <input
            type="file"
            accept="image/*"
            id="petImage"
            onChange={handleProfile}
            className="hidden"
          />
          <Label htmlFor="petImage">반려동물 프로필 등록</Label>
        </ProfileTail>
      </PetProfileDiv>
      {isViewImageCropper && (
        <CropDiv>
          <Cropper
            ref={cropperRef}
            src={image}
            viewMode={1}
            width={400}
            height={400}
            background={false}
            responsive
            autoCropArea={1}
            checkOrientation={false}
            guides
          />
          <ButtonBox>
            <Button
              text="선택"
              isgreen="true"
              handler={getCropData}
              size="lg"
            />
            <Button
              text="취소"
              isgreen="false"
              handler={handleCancle}
              size="lg"
            />
          </ButtonBox>
        </CropDiv>
      )}
    </>
  );
}
