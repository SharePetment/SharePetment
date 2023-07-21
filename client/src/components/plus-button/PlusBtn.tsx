import { useState } from 'react';
import PetInfo from '../pet/PetInfo.tsx';
import { ButtonContainer, PlusIcon } from './plusBtn.styled.tsx';

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
