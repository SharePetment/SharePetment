import { Link } from 'react-router-dom';
import WalkCard from '../card/walk-card/walkCard';
import { WalkFeed } from '@/types/walkType';
import { changeDateFormat } from '@/util/changeDateFormat';

interface WalkCardWrapProp {
  item: WalkFeed;
}

export default function WalkCardWrap({ item }: WalkCardWrapProp) {
  return (
    <Link
      to={`/walkmate/${item.walkMatePostId}`}
      key={item.walkMatePostId}
      className="w-full">
      <WalkCard
        size="lg"
        time={changeDateFormat(item.time)}
        title={item.title}
        friends={item.maximum}
        location={item.location}
        isclosed={`${item.open}`}
        nickname={item.memberInfo.nickname}
        imageURL={item.memberInfo.imageURL}
        key={item.walkMatePostId}
      />
    </Link>
  );
}
