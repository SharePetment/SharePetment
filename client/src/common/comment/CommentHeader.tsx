import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  DateText,
  UserBox,
  UserName,
  EditBtn,
  DeleteBtn,
  BtnBox,
  HeaderBox,
} from '@/common/comment/comment.styled';
import Profile from '@/common/profile/Profile';
import Path from '@/routers/paths';
import { MemberIdContext, State } from '@/store/Context';
import changeTime from '@/util/changeTime';

type Prop = {
  memberId: number;
  imageURL: string;
  nickname: string;
  createdAt: number[];
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CommentHeader({
  memberId,
  imageURL,
  nickname,
  createdAt,
  setIsEdited,
  setIsDeleted,
}: Prop) {
  const { memberId: userId } = useContext(MemberIdContext) as State;

  return (
    <HeaderBox>
      <Link to={`${Path.User}/${memberId}`} className="hover:cursor-pointer">
        <UserBox>
          <Profile size="sm" url={imageURL} isgreen={'false'} />
          <UserName>{nickname}</UserName>
          <DateText>{changeTime(createdAt)}</DateText>
        </UserBox>
      </Link>
      {userId === `${memberId}` && (
        <BtnBox>
          <EditBtn
            onClick={() => {
              setIsEdited(prev => !prev);
            }}>
            수정
          </EditBtn>
          <DeleteBtn
            onClick={() => {
              setIsDeleted(true);
            }}>
            삭제
          </DeleteBtn>
        </BtnBox>
      )}
    </HeaderBox>
  );
}
