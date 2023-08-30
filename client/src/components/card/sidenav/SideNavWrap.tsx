import * as SC from './SideNav.styled.tsx';
import { ReactComponent as Comment } from '@/assets/button/comment.svg';
import { ReactComponent as Delete } from '@/assets/button/delete.svg';
import { ReactComponent as Edit } from '@/assets/button/edit.svg';
import { ReactComponent as Like } from '@/assets/button/like.svg';
import { ReactComponent as Share } from '@/assets/button/share.svg';

type Prop = {
  children?: React.ReactNode;
  class?: string;
  onClick?: () => void;
};

export default function SideNavWrap(prop: Prop) {
  return (
    <SC.Wrap className={prop.class} onClick={prop.onClick}>
      {prop.children}
    </SC.Wrap>
  );
}

type LikeProp = {
  onClick: () => void;
  isLike: 'true' | 'false';
  accessToken: string | null;
};

const LikeIcon = (prop: LikeProp) => {
  const { onClick, isLike, accessToken } = prop;
  return (
    <Like
      className="cursor-pointer"
      stroke="black"
      fill={isLike === 'true' && accessToken ? '#69B783' : 'white'}
      onClick={onClick}
    />
  );
};

const CommentIcon = () => (
  <Comment className="cursor-pointer ml-2" stroke="black" />
);

const ShareIcon = () => <Share className="cursor-pointer ml-2" stroke="none" />;

const EditIcon = () => <Edit stroke="black" />;

const DeletIcon = () => <Delete stroke="black" />;

SideNavWrap.Like = LikeIcon;
SideNavWrap.Comment = CommentIcon;
SideNavWrap.Share = ShareIcon;
SideNavWrap.Edit = EditIcon;
SideNavWrap.Delete = DeletIcon;
