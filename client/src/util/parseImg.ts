import { FeedImage } from '../types/feedTypes';

interface ParseImgProp {
  e: React.ChangeEvent<HTMLInputElement>;
  setSavedFile: React.Dispatch<React.SetStateAction<string[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPrevFile: React.Dispatch<React.SetStateAction<(File | FeedImage)[]>>;
  savedFile: string[];
}

export const parseImg = ({
  e,
  setIsOpen,
  setSavedFile,
  savedFile,
  setPrevFile,
}: ParseImgProp) => {
  let files: File[] | undefined;
  if (e.target.files) {
    if (e.target.files.length >= 4 && savedFile.length === 0) {
      setIsOpen(true);
      files = Array.from(e.target.files);
      files = files.slice(0, 3);
    } else if (savedFile.length + e.target.files.length >= 4) {
      setIsOpen(true);
      const maximum = 3 - savedFile.length < 0 ? 0 : 3 - savedFile.length;
      files = Array.from(e.target.files);
      files = files.slice(0, maximum);
    } else {
      files = Array.from(e.target.files);
    }

    const readAndPreview = (file: File) => {
      if (/\.(jpe?g|png)$/i.test(file.name)) {
        const reader = new FileReader();
        setPrevFile(prev => {
          console.log(prev);
          return [...prev, file];
        });
        reader.readAsDataURL(file);
        return new Promise<void>(resolve => {
          reader.onload = () => {
            setSavedFile(prev => [...prev, reader.result as string]); // 파일의 컨텐츠
            resolve();
          };
        });
      }
    };
    if (files) {
      [].forEach.call(files, readAndPreview);
    }
  }
};

interface DeleteImgProp {
  setSavedFile: React.Dispatch<React.SetStateAction<string[]>>;
  savedFile: string[];
  order: number;
  setPrevFile: React.Dispatch<React.SetStateAction<(File | FeedImage)[]>>;
  prevFile: (File | FeedImage)[];
  setRemovedFile: React.Dispatch<React.SetStateAction<string[]>>;
}

export const deleteImg = ({
  savedFile,
  setSavedFile,
  order,
  setPrevFile,
  prevFile,
  setRemovedFile,
}: DeleteImgProp) => {
  let preCopy = prevFile;
  if ('originalFilename' in preCopy[order]) {
    const removeFile = preCopy[order] as FeedImage;
    setRemovedFile(prev => [...prev, removeFile.originalFilename]);
  }
  preCopy = preCopy.filter((_, idx) => idx !== order);
  let copy = savedFile;
  copy = copy.filter((_, idx) => idx !== order);

  setPrevFile(preCopy);
  setSavedFile(copy);
};
