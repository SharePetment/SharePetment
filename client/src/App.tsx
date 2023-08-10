import { Outlet, useMatch, ScrollRestoration } from 'react-router-dom';
import Footer from './common/footer/Footer.tsx';
import Header from './common/header/Header.tsx';
import NavBar from './components/nav/NavBar.tsx';
import Path from './routers/paths.ts';

function App() {
  const matchHome = useMatch(Path.Login); //object || null
  const matchInfo = useMatch(Path.Info); //object || null
  const matchFeedPopUp = useMatch(Path.FeedPopUp); //object || null
  const matchInfoEditing = useMatch(Path.InfoEditing); //object || null
  const matchFeed = useMatch(Path.Home);
  const matchFeedPosting = useMatch(Path.FeedPosting);
  const matchFeedEditing = useMatch(Path.FeedEditing);
  const loadingFeed = useMatch(Path.Loading);

  return (
    <>
      {!(
        matchHome ||
        matchInfo ||
        matchInfoEditing ||
        matchFeedPosting ||
        loadingFeed ||
        matchFeedPopUp ||
        matchFeedEditing
      ) && <Header />}
      {!(
        matchHome ||
        matchInfo ||
        matchInfoEditing ||
        matchFeedPosting ||
        loadingFeed ||
        matchFeedPopUp
      ) && <NavBar />}
      <ScrollRestoration />
      <Outlet />
      {!(
        matchHome ||
        matchInfo ||
        matchFeed ||
        matchInfoEditing ||
        matchFeedPosting ||
        matchFeedPopUp ||
        matchFeedEditing
      ) && <Footer />}
    </>
  );
}

export default App;
