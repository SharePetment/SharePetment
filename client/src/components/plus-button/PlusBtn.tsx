import { useState } from 'react';
import PetInfo from '@/components/pet/PetInfo.tsx';
import * as SC from '@/components/plus-button/plusBtn.styled.tsx';

export default function PlusBtn() {
  const [isOpened, setIsOpened] = useState(false);
  const handlePetAdding = () => {
    setIsOpened(true);
  };
  return (
    <>
      <SC.ButtonContainer onClick={handlePetAdding}>
        <SC.PlusIcon />
      </SC.ButtonContainer>
      {isOpened && (
        <PetInfo method="post" isOpend={isOpened} setIsOpened={setIsOpened} />
      )}
    </>
  );
}
