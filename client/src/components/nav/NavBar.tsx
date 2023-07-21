import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { ReactComponent as HomeActive } from '../../assets/mobile/home-active-app.svg';
import { ReactComponent as Home } from '../../assets/mobile/home-app.svg';
import { ReactComponent as Login } from '../../assets/mobile/login-app.svg';
import { ReactComponent as Logout } from '../../assets/mobile/logout-app.svg';
import { ReactComponent as MypageActive } from '../../assets/mobile/mypage-active-app.svg';
import { ReactComponent as Mypage } from '../../assets/mobile/mypage-app.svg';
import { ReactComponent as PostActive } from '../../assets/mobile/post-active-app.svg';
import { ReactComponent as Post } from '../../assets/mobile/post-app.svg';
import { ReactComponent as WalkmateActive } from '../../assets/mobile/walk-active-app.svg';
import { ReactComponent as Walkmate } from '../../assets/mobile/walk-app.svg';
import Path from '../../routers/paths.ts';

export default function NavBar() {
  const navigate = useNavigate();

  const matchHome = useMatch('/home');
  const matchWalkmate = useMatch('/walkmate');
  const matchPost = useMatch('/feed-posting');
  const matchMypage = useMatch('/my-page');
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  const handleClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  if (accessToken) {
    return (
      <nav className="hidden max-sm:block bg-white fixed bottom-[16px] rounded-[30px] left-1/2 -translate-x-[50%] z-[800] shadow-xl">
        <ul className="flex gap-8 py-3 px-10 max-sm:px-7 max-sm:gap-7">
          <Link to={Path.Home}>
            <li>
              {matchHome !== null ? (
                <HomeActive className="w-9 h-9" />
              ) : (
                <Home className="w-9 h-9" />
              )}
            </li>
          </Link>
          <Link to={Path.WalkMate}>
            <li>
              {matchWalkmate !== null ? (
                <WalkmateActive className="w-9 h-9" />
              ) : (
                <Walkmate className="w-9 h-9" />
              )}
            </li>
          </Link>
          <Link to={Path.FeedPosting}>
            <li>
              {matchPost !== null ? (
                <PostActive className="w-9 h-9" />
              ) : (
                <Post className="w-9 h-9" />
              )}
            </li>
          </Link>
          <Link to={Path.MyPage}>
            <li>
              {matchMypage !== null ? (
                <MypageActive className="w-9 h-9" />
              ) : (
                <Mypage className="w-9 h-9" />
              )}
            </li>
          </Link>
          <li className=" cursor-pointer">
            <Logout className="w-9 h-9" onClick={handleClick} />
          </li>
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="hidden max-sm:block bg-white fixed bottom-[16px] rounded-[30px] left-1/2 -translate-x-[50%] z-[800] shadow-xl">
        <ul className="flex gap-8 py-3 px-10">
          <Link to={Path.Home}>
            <li>
              {matchHome !== null ? (
                <HomeActive className="w-9 h-9" />
              ) : (
                <Home className="w-9 h-9" />
              )}
            </li>
          </Link>
          <li className=" cursor-pointer">
            <Login className="w-9 h-9" onClick={handleClick} />
          </li>
        </ul>
      </nav>
    );
  }
}
