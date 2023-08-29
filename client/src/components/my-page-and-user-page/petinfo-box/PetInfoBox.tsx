import { ReactComponent as Man } from '@/assets/label/man.svg';
import { ReactComponent as Woman } from '@/assets/label/woman.svg';
import Profile from '@/common/profile/Profile.tsx';
import {
  Container,
  Info,
  Name,
  NameBox,
  TextBox,
} from '@/components/my-page-and-user-page/petinfo-box/petInfoBox.styled';

interface Prop {
  name: string;
  information: string;
  uploadFileURL: string;
  sex: string;
}

export default function PetInfoBox(prop: Prop) {
  const { name, information, uploadFileURL, sex } = prop;
  return (
    <Container>
      <Profile isgreen="false" size="sm" url={uploadFileURL} />
      <TextBox>
        <NameBox>
          <Name>{name}</Name>
          {sex === '수컷' ? <Man /> : <Woman />}
        </NameBox>
        <Info>{information}</Info>
      </TextBox>
    </Container>
  );
}
