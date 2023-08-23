import imageCompression from 'browser-image-compression';
import { ChangeEvent } from 'react';
import { ReactCropperElement } from 'react-cropper';
import { option } from '@/util/imageCompressOption';

type Prop = {
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsViewImageCropper: React.Dispatch<React.SetStateAction<boolean>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  e: ChangeEvent<HTMLInputElement>;
};
type PetImage = ({
  e,
  setImage,
  setIsViewImageCropper,
  setIsError,
}: Prop) => void;

export const handlePetImage: PetImage = ({
  setImage,
  setIsError,
  setIsViewImageCropper,
  e,
}) => {
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

// Cropper 이미지 채택 함수
type CropperProp = {
  cropperRef: React.RefObject<ReactCropperElement>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewImageCropper: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export const handleCropperData = async (prop: CropperProp) => {
  const {
    cropperRef,
    setIsLoading,
    setImage,
    setIsError,
    setIsViewImageCropper,
    setFile,
  } = prop;

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
