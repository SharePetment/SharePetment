import { ReactComponent as Man } from '@/assets/label/man.svg';
import { ReactComponent as Woman } from '@/assets/label/woman.svg';
import Profile from '@/common/profile/Profile.tsx';
import * as SC from '@/components/my-page-and-user-page/petinfo-box/petInfoBox.styled';

interface Prop {
  name: string;
  information: string;
  uploadFileURL: string;
  sex: string;
}

export default function PetInfoBox(prop: Prop) {
  const { name, information, uploadFileURL, sex } = prop;
  return (
    <SC.Container>
      <Profile isgreen="false" size="sm" url={uploadFileURL} />
      <SC.TextBox>
        <SC.NameBox>
          <SC.Name>{name}</SC.Name>
          {sex === '수컷' ? <Man /> : <Woman />}
        </SC.NameBox>
        <SC.Info>{information}</SC.Info>
      </SC.TextBox>
    </SC.Container>
  );
}
