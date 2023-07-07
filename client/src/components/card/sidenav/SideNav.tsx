import { useNavigate } from 'react-router-dom';
import { ReactComponent as Comment } from '../../../assets/button/comment.svg';
import { ReactComponent as Delete } from '../../../assets/button/delete.svg';
import { ReactComponent as Edit } from '../../../assets/button/edit.svg';
import { ReactComponent as Like } from '../../../assets/button/like.svg';
import { ReactComponent as Share } from '../../../assets/button/share.svg';
import { BooleanStr } from '../../../types/propType';
import { Container, Wrap, Text } from './SideNav.styled';

interface Prop {
  feedid: number;
  direction: 'row' | 'col';
  inperson: BooleanStr;
}

export default function SideNav({ feedid, direction, inperson }: Prop) {
  const navigate = useNavigate();

  return (
    <Container direction={direction}>
      <Wrap>
        <Like className="cursor-pointer ml-2" stroke="black" />
        <Text>10.3만</Text>
      </Wrap>

      <Wrap onClick={() => navigate(`/home/${feedid}`)}>
        <Comment className="cursor-pointer ml-2" />
        <Text>10.3만</Text>
      </Wrap>

      <Wrap>
        <Share className="cursor-pointer ml-2" />
      </Wrap>

      {inperson === 'true' && (
        <>
          <Wrap onClick={() => navigate(`/feed-posting/${feedid}`)}>
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
