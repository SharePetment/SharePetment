import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { patchUserProfile } from '../../../api/mutationfn';
import PetInfo from '../../pet/PetInfo';
import PetInfoBox from '../petinfo-box/PetInfoBox';
import { Container, PetCheck, SettingPet } from './petContainer.styled';

interface Prop {
  name: string;
  information: string;
  petId: number;
  sex: string;
  age: number;
  uploadFileUrl: string;
  isPetCheck: number | undefined;
  memberId: string;
  setIsPetCheck: React.Dispatch<React.SetStateAction<number | undefined>>;
  setUserProfileImage: React.Dispatch<React.SetStateAction<string>>;
}
// petCheck 여부 확인하기
export default function PetContainer(prop: Prop) {
  const {
    name,
    information,
    petId,
    sex,
    age,
    uploadFileUrl,
    setIsPetCheck,
    isPetCheck,
    memberId,
    setUserProfileImage,
  } = prop;

  const [isPetOpened, setIsPetOpened] = useState(false);

  const mutationPatchUserProfile = useMutation({
    mutationFn: patchUserProfile,
    onSuccess: data => {
      setUserProfileImage(data);
    },
  });
  // 유저 프로필 변경
  const handleChangeUserProfile = (petId: number) => {
    // 추후 작성
    setIsPetCheck(petId);
    mutationPatchUserProfile.mutate(`members/${memberId}/${petId}`);
  };

  // 펫 정보 수정
  const handlePetEdit = () => {
    setIsPetOpened(true);
  };
  return (
    <>
      <Container>
        <PetCheck
          check={isPetCheck === petId ? 'true' : 'false'}
          onClick={() => handleChangeUserProfile(petId)}
        />
        <PetInfoBox
          name={name}
          uploadFileUrl={uploadFileUrl}
          information={information}
          sex={sex}
        />
        <SettingPet onClick={handlePetEdit} />
      </Container>
      {isPetOpened && (
        <PetInfo
          method="patch"
          isOpend={isPetOpened}
          setIsOpened={setIsPetOpened}
          petId={petId}
          profile={uploadFileUrl}
          name={name}
          age={age}
          sex={sex}
          information={information}
        />
      )}
    </>
  );
}
