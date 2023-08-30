import { useState, useEffect } from 'react';
import PetContainer from '@/components/my-page-and-user-page/pet-container/PetContainer';
import * as SC from '@/components/my-page-and-user-page/pet-container-list/petContainerList.styled';
import PetInfoBox from '@/components/my-page-and-user-page/petinfo-box/PetInfoBox';
import PlusBtn from '@/components/plus-button/PlusBtn.tsx';
import { UserInfo } from '@/types/userType';

type Prop = {
  type: 'userPage' | 'myPage';
  data: UserInfo | undefined;
};

export default function PetContainerList({ type, data }: Prop) {
  // 펫 check 여부
  const [isPetCheck, setIsPetCheck] = useState(-1);

  // 마이페이지의 유저 이미지와 일치하는 펫 이미지가 있는지 index를 통해 탐색
  useEffect(() => {
    if (type === 'myPage') {
      let indexNumber: number | undefined;
      if (typeof data?.memberInfo === 'object') {
        const userImage = data?.memberInfo.imageURL;
        const petArray = data?.pets.map(({ images }) => images.uploadFileURL);
        indexNumber = petArray?.indexOf(userImage);
        setIsPetCheck(indexNumber);
      }
    }
  }, [data, type]);

  return (
    <>
      {type === 'myPage' && (
        <SC.PetBox>
          {Array.isArray(data?.pets) && (
            <>
              {data?.pets.map(
                (
                  {
                    images: { uploadFileURL },
                    name,
                    information,
                    petId,
                    sex,
                    age,
                  },
                  index,
                ) => (
                  <PetContainer
                    key={petId}
                    name={name}
                    information={information}
                    petId={petId}
                    sex={sex}
                    age={age}
                    uploadFileURL={uploadFileURL}
                    isPetCheck={isPetCheck}
                    setIsPetCheck={setIsPetCheck}
                    index={index}
                  />
                ),
              )}
            </>
          )}
          <PlusBtn />
        </SC.PetBox>
      )}
      {type === 'userPage' && (
        <SC.PetBox>
          {Array.isArray(data?.pets) && (
            <>
              {data?.pets.map(
                (
                  { images: { uploadFileURL }, name, information, sex },
                  index,
                ) => (
                  <PetInfoBox
                    key={index}
                    name={name}
                    information={information}
                    sex={sex}
                    uploadFileURL={uploadFileURL}
                  />
                ),
              )}
            </>
          )}
        </SC.PetBox>
      )}
    </>
  );
}
