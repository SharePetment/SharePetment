import { Feed } from '@/types/feedTypes';

export default interface QueryProp {
  key?: (string | number)[];
  url: string;
  accessToken: string | null;
}

export const DefaultData: Feed = {
  feedId: 0,
  memberInfo: {
    memberId: 0,
    nickname: '',
    imageURL: '',
  },
  images: [],
  content: '',
  likes: 0,
  feedComments: null,
  shareURL: '',
  createdAt: [],
  modifiedAt: [],
  isLike: false,
};
