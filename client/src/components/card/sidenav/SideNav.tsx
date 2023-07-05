import { ReactComponent as Comment } from '../../../assets/button/comment.svg';
import { ReactComponent as Delete } from '../../../assets/button/delete.svg';
import { ReactComponent as Edit } from '../../../assets/button/edit.svg';
import { ReactComponent as Like } from '../../../assets/button/like.svg';
import { ReactComponent as Share } from '../../../assets/button/share.svg';
import { Container, Wrap, Text } from './SideNav.styled';

interface Prop {
  direction: 'row' | 'col';
  inperson: boolean;
}

export default function SideNav({ direction, inperson }: Prop) {
  return (
    <Container direction={direction}>
      <Wrap>
        <Like className="cursor-pointer ml-2" />
        <Text>10.3만</Text>
      </Wrap>

      <Wrap>
        <Comment className="cursor-pointer ml-2" />
        <Text>10.3만</Text>
      </Wrap>

      <Wrap>
        <Share className="cursor-pointer ml-2" />
      </Wrap>

      {inperson && (
        <>
          <Wrap>
            <Edit className="cursor-pointer ml-2" />
          </Wrap>
          <Wrap>
            <Delete className="cursor-pointer ml-2" />
          </Wrap>
        </>
      )}
    </Container>
  );
}
