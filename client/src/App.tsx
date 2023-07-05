import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Footer from './common/footer/Footer';
import Header from './common/header/Header';
import Popup from './common/popup/Popup';

function App() {
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(true);
  const handleClose = () => {
    setIsOpened(false);
  };
  const handleNavigate = () => {
    setIsOpened(false);
    navigate('/123');
  };
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center bg-slate"></div>
      {isOpened && (
        <Popup
          title="회원가입을 하셔야 사용합니다"
          handler={[handleClose, handleNavigate]}
          btnsize={['md', 'md']}
          countbtn={2}
          buttontext={['닫기', '확인']}
          isgreen={['true', 'false']}
          popupcontrol={handleClose}
        />
      )}

      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
