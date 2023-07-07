import { Outlet, useMatch } from 'react-router-dom';
import Footer from './common/footer/Footer';
import Header from './common/header/Header';

function App() {
  const matchHome = useMatch('/'); //object || null
  const matchInfo = useMatch('/info'); //object || null

  return (
    <>
      {!(matchHome || matchInfo) && <Header isloginuser="true" />}
      <Outlet />
      {!(matchHome || matchInfo) && <Footer />}
    </>
  );
}

export default App;
