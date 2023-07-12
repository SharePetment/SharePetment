import { MemberInfo } from './commentType';
import { Pets } from './petType';

export interface UserInfo {
  memberInfo: MemberInfo;
  name: string | number | readonly string[] | undefined;
  email?: string;
  address: string;
  followerCount: number;
  animalParents: boolean;
  guestFollow: boolean;
  pets: Pets[];
  createdAt: number[];
  modifiedAt: number[];
}

// 팔로잉 회원 리스트 조회

export type Follow = {
  followerId: number;
  followingId: number;
  memberInfo: MemberInfo;
  follow: boolean;
  createdAt: number;
  modifiedAt: number;
};
