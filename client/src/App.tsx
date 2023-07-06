import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Footer from './common/footer/Footer';
import Header from './common/header/Header';
import Popup from './common/popup/Popup';
import FeedEditCard from './components/card/feedwritecard/FeedEditCard';

function App() {
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(false);
  const handleClose = () => {
    setIsOpened(false);
  };
  const handleNavigate = () => {
    setIsOpened(false);
    navigate('/123');
  };
  return (
    <>
      <FeedEditCard />
    </>
  );
}

export default App;
