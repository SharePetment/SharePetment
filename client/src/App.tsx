import { Outlet, useMatch } from 'react-router-dom';
import Footer from './common/footer/Footer';
import Header from './common/header/Header';

function App() {
  const matchHome = useMatch('/'); //object || null
  const matchInfo = useMatch('/info'); //object || null
  const matchInfoEditing = useMatch('/info/:userId'); //object || null
  const matchFeed = useMatch('/home');
  const matchFeedPosting = useMatch('/feed-posting');
  const loadingFeed = useMatch('/loading');

  return (
    <>
      {!(matchHome || matchInfo || matchInfoEditing || matchFeedPosting || loadingFeed) && (
        <Header isloginuser="true" />
      )}
      <Outlet />
      {!(
        matchHome ||
        matchInfo ||
        matchFeed ||
        matchInfoEditing ||
        matchFeedPosting
      ) && <Footer />}
    </>
  );
}

export default App;
