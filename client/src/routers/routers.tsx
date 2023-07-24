import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import Login from '../pages/login/Login.tsx';
import NotFound from '../pages/notFound/NotFound.tsx';
import Path from './paths.ts';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: Path.Login,
        element: <Login />,
      },
      {
        path: Path.Info,
        lazy: () => import('../pages/info/Info'),
      },
      {
        path: Path.InfoEditing,
        lazy: () => import('../pages/info/Info'),
      },
      {
        path: Path.Home,
        lazy: () => import('../pages/home/Home'),
      },
      {
        path: Path.MyPage,
        lazy: () => import('../pages/myPage/MyPage'),
      },
      {
        path: Path.Userpage,
        lazy: () => import('../pages/userpage/UserPage'),
      },
      {
        path: Path.FeedPopUp,
        lazy: () => import('../pages/feedPopUp/FeedPopUp'),
      },
      {
        path: Path.CopyPopUp,
        lazy: () => import('../pages/copyPopUp/CopyPopUp'),
      },
      {
        path: Path.FeedPosting,
        lazy: () => import('../pages/feedPosting/FeedPosting'),
      },
      {
        path: Path.FeedEditing,
        lazy: () => import('../pages/feedPosting/FeedPosting'),
      },
      {
        path: Path.WalkMate,
        lazy: () => import('../pages/walkMate/WalkMate'),
      },
      {
        path: Path.WalkFeed,
        lazy: () => import('../pages/walkFeed/WalkFeed'),
      },
      {
        path: Path.WalkPosting,
        lazy: () => import('../pages/walkPosting/WalkPosting'),
      },
      {
        path: Path.WalkEditing,
        lazy: () => import('../pages/walkEditing/WalkEditing'),
      },
      {
        path: Path.Loading,
        lazy: () => import('../pages/loading/Loading'),
      },
    ],
  },
]);
