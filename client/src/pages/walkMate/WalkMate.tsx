import { Link } from 'react-router-dom';
import WalkCard from '../../components/card/walkCard/walkCard';
import Path from '../../routers/paths';

export function Component() {
  return (
    <div className=" flex flex-wrap gap-5">
      <Link to={Path.WalkFeed}>
        <WalkCard
          time="07. 06 일요일 오후 6:30"
          title="같이 산책해요!"
          freinds={3}
          location="서울특별시 동대문구 종로3가일까 4가일까"
          chaturl="open.kakao.com/o/gH0XvThc"
          isclosed="true"
        />
      </Link>
      <Link to={Path.WalkFeed}>
        <WalkCard
          time="07. 06 일요일 오후 6:30"
          title="같이 산책해요!"
          freinds={3}
          location="서울특별시 동대문구 종로3가일까 4가일까"
          chaturl="open.kakao.com/o/gH0XvThc"
          isclosed="false"
        />
      </Link>
    </div>
  );
}

Component.displayName = 'WalkMate';
