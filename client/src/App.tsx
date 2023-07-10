import { Outlet, useMatch } from 'react-router-dom';
import Footer from './common/footer/Footer';
import Header from './common/header/Header';

function App() {
  const matchHome = useMatch('/'); //object || null
  const matchInfo = useMatch('/info'); //object || null
  const matchInfoEditing = useMatch('/info/:userId'); //object || null
  const matchFeed = useMatch('/home');

  return (
    <>
      {!(matchHome || matchInfo || matchInfoEditing) && (
        <Header isloginuser="true" />
      )}
      <Outlet />
      {!(matchHome || matchInfo || matchFeed || matchInfoEditing) && <Footer />}
    </>
  );
}

export default App;
