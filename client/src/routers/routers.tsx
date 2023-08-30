import { createBrowserRouter } from 'react-router-dom';
import App from '@/App.tsx';
import Login from '@/pages/login/Login.tsx';
import NotFound from '@/pages/notFound/NotFound.tsx';
import Path from '@/routers/paths.ts';
import { aouthLoder, unAouthLoder } from '@/util/aouthLoder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: Path.Login,
        element: <Login />,
        loader: aouthLoder,
      },
      {
        path: Path.Info,
        lazy: () => import('@/pages/info/Info'),
        loader: unAouthLoder,
      },
      {
        path: Path.InfoEditing,
        lazy: () => import('@/pages/info/Info'),
        loader: unAouthLoder,
      },
      {
        path: Path.Home,
        lazy: () => import('@/pages/home/Home'),
      },
      {
        path: Path.MyPage,
        lazy: () => import('@/pages/myPage/MyPage'),
        loader: unAouthLoder,
      },
      {
        path: Path.Userpage,
        lazy: () => import('@/pages/userpage/UserPage'),
      },
      {
        path: Path.FeedPopUp,
        lazy: () => import('@/pages/feedPopUp/FeedPopUp'),
      },
      {
        path: Path.FeedPosting,
        lazy: () => import('@/pages/feedPosting/FeedPosting'),
        loader: unAouthLoder,
      },
      {
        path: Path.FeedEditing,
        lazy: () => import('@/pages/feedPosting/FeedPosting'),
        loader: unAouthLoder,
      },
      {
        path: Path.WalkMate,
        lazy: () => import('@/pages/walkMate/WalkMate'),
        loader: unAouthLoder,
      },
      {
        path: Path.WalkFeed,
        lazy: () => import('@/pages/walkFeed/WalkFeed'),
        loader: unAouthLoder,
      },
      {
        path: Path.WalkPosting,
        lazy: () => import('@/pages/walkPosting/WalkPosting'),
        loader: unAouthLoder,
      },
      {
        path: Path.WalkEditing,
        lazy: () => import('@/pages/walkEditing/WalkEditing'),
        loader: unAouthLoder,
      },
      {
        path: Path.Loading,
        lazy: () => import('@/pages/loading/Loading'),
      },
    ],
  },
]);
