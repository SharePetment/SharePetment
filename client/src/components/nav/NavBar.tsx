import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import * as SC from './NavBar.styled';
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
      <SC.NavContainer>
        <SC.HostList>
          <NavTab route="Home" />
          <NavTab route="WalkMate" />
          <NavTab route="WalkPosting" />
          <NavTab route="Mypage" />

          <li className=" cursor-pointer">
            <Logout className="w-9 h-9" onClick={handleClick} />
          </li>
        </SC.HostList>
      </SC.NavContainer>
    );
  } else {
    return (
      <SC.NavContainer>
        <SC.HostList>
          <NavTab route="Home" />
          <li className="cursor-pointer">
            <Login className="w-9 h-9" onClick={handleClick} />
          </li>
        </SC.HostList>
      </SC.NavContainer>
    );
  }
}
