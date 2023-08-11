import { useState } from 'react';
import PetInfo from '@/components/pet/PetInfo.tsx';
import {
  ButtonContainer,
  PlusIcon,
} from '@/components/plus-button/plusBtn.styled.tsx';

export default function PlusBtn() {
  const [isOpened, setIsOpened] = useState(false);
  const handlePetAdding = () => {
    setIsOpened(true);
  };
  return (
    <>
      <ButtonContainer onClick={handlePetAdding}>
        <PlusIcon />
      </ButtonContainer>
      {isOpened && (
        <PetInfo method="post" isOpend={isOpened} setIsOpened={setIsOpened} />
      )}
    </>
  );
}
