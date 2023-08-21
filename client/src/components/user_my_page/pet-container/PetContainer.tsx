import { useState } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import PetInfoBox from '../petinfo-box/PetInfoBox.tsx';
import { SERVER_URL } from '@/api/url.ts';
import AlertText from '@/common/popup/AlertText.ts';
import Popup from '@/common/popup/Popup.tsx';
import PetInfo from '@/components/pet/PetInfo.tsx';
import {
  Container,
  DeletePet,
  PetCheckFalse,
  PetCheckTrue,
  SettingPet,
} from '@/components/user_my_page/pet-container/petContainer.styled.tsx';
import useDeleteMutation from '@/hook/api/mutation/useDeleteMutation.tsx';
import usePatchMutation from '@/hook/api/mutation/usePatchMutation.tsx';

interface Prop {
  name: string;
  information: string;
  petId: number;
  sex: string;
  age: number;
  uploadFileURL: string;
  isPetCheck: number | undefined;
  setIsPetCheck: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}
// petCheck 여부 확인하기
export default function PetContainer(prop: Prop) {
  const {
    name,
    information,
    petId,
    sex,
    age,
    uploadFileURL,
    setIsPetCheck,
    isPetCheck,
    index,
  } = prop;

  // 펫 등록 수정 띄위기
  const [isPetOpened, setIsPetOpened] = useState(false);

  // 펫 삭제 확인 팝업 작성
  const [isDeletePopUp, setIsDeletePopUp] = useState(false);
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  // 펫 수정 및 삭제 오류 팝업
  const [isErrorPopUp, setIsErrorPopUp] = useState(false);

  // 펫 삭제 로직 작성

  const deletePetMutation = useDeleteMutation({
    keys: [['myPage']],
    successFn: () => setIsDeletePopUp(false),
    errorFn: () => {
      setIsDeletePopUp(false);
      setIsErrorPopUp(true);
    },
  });

  const handleDeletePet = () => {
    deletePetMutation.mutate({
      url: `${SERVER_URL}/pets/${petId}`,
      accessToken,
    });
  };

  const handleOpenDeletePopup = () => {
    setIsDeletePopUp(true);
  };

  const mutationPatchUserProfile = usePatchMutation({
    key: ['myPage'],
    errorFn: () => setIsErrorPopUp(true),
  });

  // 유저 프로필 변경
  const handleChangeUserProfile = (petId: number, index: number) => {
    setIsPetCheck(index);
    mutationPatchUserProfile.mutate({
      url: `${SERVER_URL}/members/image/${petId}`,
      accessToken: accessToken as string,
    });
  };

  // 펫 정보 수정
  const handlePetEditPopUp = () => {
    setIsPetOpened(true);
  };

  return (
    <>
      <Container>
        {isPetCheck !== index && (
          <PetCheckFalse
            onClick={() => handleChangeUserProfile(petId, index)}
          />
        )}
        {isPetCheck === index && (
          <PetCheckTrue onClick={() => handleChangeUserProfile(petId, index)} />
        )}
        <PetInfoBox
          name={name}
          uploadFileURL={uploadFileURL}
          information={information}
          sex={sex}
        />
        <DeletePet onClick={handleOpenDeletePopup} stroke="black" />
        <SettingPet onClick={handlePetEditPopUp} />
      </Container>
      {isPetOpened && (
        <PetInfo
          method="patch"
          isOpend={isPetOpened}
          setIsOpened={setIsPetOpened}
          petId={petId}
          profile={uploadFileURL}
          name={name}
          age={age}
          sex={sex}
          information={information}
        />
      )}
      {isDeletePopUp && (
        <Popup
          title={AlertText.Delete}
          countbtn={2}
          popupcontrol={() => {
            setIsDeletePopUp(false);
          }}
          handler={[
            handleDeletePet,
            () => {
              setIsDeletePopUp(false);
            },
          ]}
        />
      )}
      {isErrorPopUp && (
        <Popup
          title={AlertText.Failed}
          handler={[
            () => {
              setIsErrorPopUp(false);
            },
          ]}
          popupcontrol={() => {
            setIsErrorPopUp(false);
          }}
        />
      )}
    </>
  );
}
