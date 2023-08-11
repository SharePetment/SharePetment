import { useMatch, Link } from 'react-router-dom';
import tw from 'tailwind-styled-components';
import Path from '@/routers/paths';
import { BooleanStr } from '@/types/propType';

const NavItemContainer = tw.li<{ active: BooleanStr }>`
  font-bold
  cursor-pointer
  ${prop => (prop.active === 'true' ? `text-deepgray` : `text-deepgreen`)}
`;

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
        <NavItemContainer active={matchHome !== null ? 'false' : 'true'}>
          <Link to={Path.Home}>홈</Link>
        </NavItemContainer>
      );
    case 'Walk':
      return (
        <NavItemContainer active={matchWalkmate !== null ? 'false' : 'true'}>
          <Link to={Path.WalkMate}>산책</Link>
        </NavItemContainer>
      );
    case 'NoWalk':
      return (
        <NavItemContainer
          active={matchWalkmate !== null ? 'false' : 'true'}
          className="cursor-pointer"
          onClick={handler}>
          산책
        </NavItemContainer>
      );
    case 'Post':
      return (
        <NavItemContainer active={matchPost !== null ? 'false' : 'true'}>
          <Link to={Path.FeedPosting}>포스트</Link>
        </NavItemContainer>
      );
    case 'NoPost':
      return (
        <NavItemContainer
          active="true"
          className="cursor-pointer"
          onClick={handler}>
          포스트
        </NavItemContainer>
      );
  }
}
