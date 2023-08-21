import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import NavTab from './NavTab';
import { ReactComponent as Login } from '@/assets/mobile/login-app.svg';
import { ReactComponent as Logout } from '@/assets/mobile/logout-app.svg';
import Path from '@/routers/paths.ts';

export default function NavBar() {
  const navigate = useNavigate();
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  const handleClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate(Path.Login);
  };

  if (accessToken) {
    return (
      <nav className="hidden max-sm:block bg-white fixed bottom-[16px] rounded-[30px] left-1/2 -translate-x-[50%] z-[800] shadow-xl">
        <ul className="flex gap-8 py-3 px-10 max-sm:px-7 max-sm:gap-7">
          <NavTab route="Home" />
          <NavTab route="WalkMate" />
          <NavTab route="WalkPosting" />
          <NavTab route="Mypage" />

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
          <NavTab route="Home" />
          <li className="cursor-pointer">
            <Login className="w-9 h-9" onClick={handleClick} />
          </li>
        </ul>
      </nav>
    );
  }
}
