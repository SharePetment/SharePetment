import { useContext } from 'react';
import { Link } from 'react-router-dom';
import * as SC from '@/common/comment/comment.styled';
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
    <SC.HeaderBox>
      <Link to={`${Path.User}/${memberId}`} className="hover:cursor-pointer">
        <SC.UserBox>
          <Profile size="sm" url={imageURL} isgreen={'false'} />
          <SC.UserName>{nickname}</SC.UserName>
          <SC.DateText>{changeTime(createdAt)}</SC.DateText>
        </SC.UserBox>
      </Link>
      {userId === `${memberId}` && (
        <SC.BtnBox>
          <SC.EditBtn
            onClick={() => {
              setIsEdited(prev => !prev);
            }}>
            수정
          </SC.EditBtn>
          <SC.DeleteBtn
            onClick={() => {
              setIsDeleted(true);
            }}>
            삭제
          </SC.DeleteBtn>
        </SC.BtnBox>
      )}
    </SC.HeaderBox>
  );
}
