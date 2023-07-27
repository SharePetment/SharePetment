import { CommentProp, MemberInfo } from './commentType.ts';

export type FeedImage = {
  imageId: number;
  originalFilename: string;
  uploadFileURL: string;
};

export type Feed = {
  feedId: number;
  memberInfo: MemberInfo;
  images: FeedImage[];
  content: string;
  likes: number;
  feedComments: null | CommentProp;
  shareURL: string;
  createdAt: number[];
  modifiedAt: number[];
  isLike: boolean;
};
