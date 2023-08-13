import { useMatch, Link } from 'react-router-dom';
import * as SC from './NavItem.styled';
import Path from '@/routers/paths';

interface NavItemProp {
  path: 'Home' | 'Walk' | 'NoWalk' | 'Post' | 'NoPost';
  handler?: () => void;
}

export default function NavItem({ path, handler }: NavItemProp) {
  const matchHome = useMatch(Path.Home);
  const matchWalkmate = useMatch(Path.WalkMate);
  const matchPost = useMatch(Path.FeedPosting);

  switch (path) {
    case 'Home':
      return (
        <SC.NavItemContainer active={matchHome !== null ? 'false' : 'true'}>
          <Link to={Path.Home}>홈</Link>
        </SC.NavItemContainer>
      );
    case 'Walk':
      return (
        <SC.NavItemContainer active={matchWalkmate !== null ? 'false' : 'true'}>
          <Link to={Path.WalkMate}>산책</Link>
        </SC.NavItemContainer>
      );
    case 'NoWalk':
      return (
        <SC.NavItemContainer
          active={matchWalkmate !== null ? 'false' : 'true'}
          className="cursor-pointer"
          onClick={handler}>
          산책
        </SC.NavItemContainer>
      );
    case 'Post':
      return (
        <SC.NavItemContainer active={matchPost !== null ? 'false' : 'true'}>
          <Link to={Path.FeedPosting}>포스트</Link>
        </SC.NavItemContainer>
      );
    case 'NoPost':
      return (
        <SC.NavItemContainer
          active="true"
          className="cursor-pointer"
          onClick={handler}>
          포스트
        </SC.NavItemContainer>
      );
  }
}
