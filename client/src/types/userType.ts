import { MemberInfo } from './commentType.ts';
import { Pets } from './petType.ts';

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
  feedCount: number;
}

// 팔로잉 회원 리스트 조회

export type Follow = {
  createdAt: string;
  memberInfo: MemberInfo;
  modifiedAt: string;
};
