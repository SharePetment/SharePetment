import { ReactComponent as Paw } from '../../../assets/button/like.svg';
import { ReactComponent as Dog } from '../../../assets/dog.svg';
import { ReactComponent as Pin } from '../../../assets/pin.svg';
import Profile from '../../../common/profile/Profile';
import { BooleanStr } from '../../../types/propType';
import {
  Backdrop,
  CardContainer,
  CompleteNotice,
  WalkDate,
  Title,
  WalkMateList,
  WalkMateItem,
  LocationTitle,
  WriterProfile,
  CompleteText,
} from './walkCard.styled';

type walkCardProps = {
  time: string;
  title: string;
  friends: number;
  location: string;
  chaturl?: string;
  isclosed: BooleanStr;
  size: 'lg' | 'sm';
};

export default function WalkCard({
  time,
  title,
  friends,
  location,
  isclosed,
  size,
}: walkCardProps) {
  return (
    <CardContainer size={size}>
      <WalkDate>
        <div className="text-xs">산책날짜</div>
        <div>{time}</div>
      </WalkDate>
      <Title>{title}</Title>
      <WalkMateList>
        <WalkMateItem>
          <Dog className="shrink-0" />
          <span>{friends}마리</span>
        </WalkMateItem>
        <WalkMateItem>
          <Pin className="shrink-0" />
          <LocationTitle>{location}</LocationTitle>
        </WalkMateItem>
      </WalkMateList>
      <WriterProfile>
        {/* TODO:이후 수정 필요 */}
        <Profile size="sm" url="https://huchu.link/MZFVNjh" isgreen="false" />
        <span className="text-semibold">Hello_world</span>
      </WriterProfile>
      {isclosed === 'false' && (
        <>
          <Backdrop size={size}>
            <CompleteNotice className="flex items-center">
              <Paw className="shrink-0" />
              <CompleteText>모집 완료</CompleteText>
            </CompleteNotice>
          </Backdrop>
        </>
      )}
    </CardContainer>
  );
}
