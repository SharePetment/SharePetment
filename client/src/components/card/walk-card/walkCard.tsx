import * as SC from './walkCard.styled';
import { ReactComponent as Dog } from '@/assets/dog.svg';
import { ReactComponent as Pin } from '@/assets/pin.svg';
import Profile from '@/common/profile/Profile.tsx';
import CompleteBox from '@/components/card/walk-card/CompleteNotice';
import { BooleanStr } from '@/types/propType.ts';

type walkCardProps = {
  time: string;
  title: string;
  friends: number;
  location: string;
  chaturl?: string;
  isclosed: BooleanStr;
  size: 'lg' | 'sm';
  nickname: string;
  imageURL: string;
};

export default function WalkCard({
  time,
  title,
  friends,
  location,
  isclosed,
  size,
  nickname,
  imageURL,
}: walkCardProps) {
  return (
    <SC.CardContainer size={size}>
      {/* 요일 */}
      <SC.WalkDate>
        <div className="text-xs">산책날짜</div>
        <div className=" whitespace-nowrap overflow-hidden">{time}</div>
      </SC.WalkDate>

      {/* 제목 */}
      <SC.Title>{title}</SC.Title>

      <SC.WalkMateList>
        {/* 허용 반려동물 수 */}
        <SC.WalkMateItem>
          <Dog className="shrink-0" />
          <span>{friends}마리</span>
        </SC.WalkMateItem>
        {/* 위치 정보 표시 */}
        <SC.WalkMateItem>
          <Pin className="shrink-0" />
          <SC.LocationTitle>{location}</SC.LocationTitle>
        </SC.WalkMateItem>
      </SC.WalkMateList>

      {/* 하단 프로필 */}
      <SC.WriterProfile>
        <Profile size="sm" url={imageURL} isgreen="false" />
        <span className="text-semibold">{nickname}</span>
      </SC.WriterProfile>

      {/* 모집완료 처리 */}
      {isclosed === 'false' && (
        <>
          <CompleteBox size={size} />
        </>
      )}
    </SC.CardContainer>
  );
}
