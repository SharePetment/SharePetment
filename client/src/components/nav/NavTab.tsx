import { Link, useMatch } from 'react-router-dom';
import { ReactComponent as HomeActive } from '@/assets/mobile/home-active-app.svg';
import { ReactComponent as Home } from '@/assets/mobile/home-app.svg';
import { ReactComponent as MypageActive } from '@/assets/mobile/mypage-active-app.svg';
import { ReactComponent as Mypage } from '@/assets/mobile/mypage-app.svg';
import { ReactComponent as PostActive } from '@/assets/mobile/post-active-app.svg';
import { ReactComponent as Post } from '@/assets/mobile/post-app.svg';
import { ReactComponent as WalkmateActive } from '@/assets/mobile/walk-active-app.svg';
import { ReactComponent as Walkmate } from '@/assets/mobile/walk-app.svg';
import Path from '@/routers/paths';

interface Route {
  route: 'Home' | 'WalkMate' | 'WalkPosting' | 'Mypage';
}

export default function NavTab({ route }: Route) {
  const matchHome = useMatch(Path.Home);
  const matchWalkmate = useMatch(Path.WalkMate);
  const matchPost = useMatch(Path.WalkPosting);
  const matchMypage = useMatch(Path.MyPage);

  switch (route) {
    case 'Home':
      return (
        <Link to={Path.Home}>
          <li>
            {matchHome !== null ? (
              <HomeActive className="w-9 h-9" />
            ) : (
              <Home className="w-9 h-9" />
            )}
          </li>
        </Link>
      );

    case 'WalkMate':
      return (
        <Link to={Path.WalkMate}>
          <li>
            {matchWalkmate !== null ? (
              <WalkmateActive className="w-9 h-9" />
            ) : (
              <Walkmate className="w-9 h-9" />
            )}
          </li>
        </Link>
      );

    case 'WalkPosting':
      return (
        <Link to={Path.FeedPosting}>
          <li>
            {matchPost !== null ? (
              <PostActive className="w-9 h-9" />
            ) : (
              <Post className="w-9 h-9" />
            )}
          </li>
        </Link>
      );
    case 'Mypage':
      return (
        <Link to={Path.MyPage}>
          <li>
            {matchMypage !== null ? (
              <MypageActive className="w-9 h-9" />
            ) : (
              <Mypage className="w-9 h-9" />
            )}
          </li>
        </Link>
      );
  }
}
