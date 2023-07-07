import { useState } from 'react';
import PetInfo from '../../components/pet/PetInfo';

export function Component() {
  const [isPetOpened, setIsPetOpened] = useState(true);
  return (
    <>
      <div>Hme</div>
      {isPetOpened && (
        <PetInfo
          name="son"
          age={10}
          sex="암컷"
          setIsOpened={setIsPetOpened}
          method="post"
          isOpend={isPetOpened}
        />
      )}
    </>
  );
}

Component.displayName = 'Home';
