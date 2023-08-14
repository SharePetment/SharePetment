export interface MemberInfo {
  memberId: number;
  nickname: string;
  imageURL: string;
}

export type CommentProp = {
  content: string;
  createdAt: number[];
  modifiedAt: number[];
  memberInfo: MemberInfo;
  walkMateCommentId?: number;
  feedCommentsId?: number;
  feedPostId?: number;
  walkMatePostId?: string;
  type: 'walk' | 'feed';
};
