import { CommentProp, MemberInfo } from './commentType.ts';

// 산책 게시물 리스트
export interface WalkFeedList {
  walkMatePostId: number;
  memberId: number;
  title: string;
  content: string;
  mapURL: string;
  chatURL: string;
  location: string;
  time: string;
  open: boolean;
  maximum: number;
  likeCount: number;
  createdAt: number[];
  modifiedAt: number[];
}

// 산책 게시물 디테일
export interface WalkFeed extends WalkFeedList {
  memberInfo: MemberInfo;
  comments: CommentProp[];
}
