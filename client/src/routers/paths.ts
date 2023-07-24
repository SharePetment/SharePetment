enum Path {
  Login = '/',
  Info = '/info',
  InfoEditing = 'info/:userId',
  Home = '/home',
  MyPage = '/my-page',
  Userpage = '/users/:usersId',
  FeedPopUp = '/home/:feedId',
  CopyPopUp = 'copy/:feedId',
  FeedPosting = '/feed-posting',
  FeedEditing = '/feed-posting/:feedId',
  WalkMate = '/walkmate',
  WalkFeed = '/walkmate/:postId',
  WalkPosting = '/walk-posting',
  WalkEditing = '/walk-posting/:postId',
  Loading = '/loading',
}

export default Path;
