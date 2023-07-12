export interface MemberInfo {
  memberId: number;
  nickname: string;
  imageURL: string;
}

export type CommentProp = {
  feedCommentsId?: number;
  walkMatePostId?: number;
  memberInfo: MemberInfo;
  content: string;
  createdAt: number[];
  modifiedAt: number[];
};
