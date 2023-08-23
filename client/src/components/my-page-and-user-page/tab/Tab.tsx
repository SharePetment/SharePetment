import { ReactComponent as CommentListIcon } from '@/assets/comment-list.svg';
import { ReactComponent as FeedIcon } from '@/assets/feed.svg';
import { ReactComponent as WalkFeedIcon } from '@/assets/walk-feed.svg';
import * as SC from '@/components/my-page-and-user-page/tab/tab.styled';

type Prop = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  currentTab: number;
  type: 'userPage' | 'myPage';
};

export default function Tab({ setCurrentTab, currentTab, type }: Prop) {
  return (
    <>
      {type === 'myPage' && (
        <SC.TabMenu>
          <SC.TabMenuList
            onClick={() => setCurrentTab(0)}
            className={
              currentTab === 0 ? `border-t-2 border-t-[green] ` : undefined
            }>
            <FeedIcon
              stroke={currentTab === 0 ? `#69B783` : '#d4d4d8'}
              className="cursor-pointer"
            />
          </SC.TabMenuList>
          <SC.TabMenuList
            onClick={() => setCurrentTab(1)}
            className={
              currentTab === 1 ? `border-t-2 border-t-[green]` : undefined
            }>
            <WalkFeedIcon
              fill={currentTab === 1 ? `#69B783` : '#d4d4d8'}
              className="cursor-pointer"
            />
          </SC.TabMenuList>
          <SC.TabMenuList
            onClick={() => setCurrentTab(2)}
            className={
              currentTab === 2 ? `border-t-2 border-t-[green]` : undefined
            }>
            <CommentListIcon
              stroke={currentTab === 2 ? `#69B783` : '#d4d4d8'}
              className="cursor-pointer"
            />
          </SC.TabMenuList>
        </SC.TabMenu>
      )}

      {type === 'userPage' && (
        <SC.TabMenu>
          <SC.TabMenuList
            onClick={() => setCurrentTab(0)}
            className={
              currentTab === 0 ? `border-t-2 border-t-[green] ` : undefined
            }>
            <FeedIcon
              stroke={currentTab === 0 ? `#69B783` : '#d4d4d8'}
              className="cursor-pointer"
            />
          </SC.TabMenuList>
          <SC.TabMenuList
            onClick={() => setCurrentTab(1)}
            className={
              currentTab === 1 ? `border-t-2 border-t-[green]` : undefined
            }>
            <WalkFeedIcon
              fill={currentTab === 1 ? `#69B783` : '#d4d4d8'}
              className="cursor-pointer"
            />
          </SC.TabMenuList>
        </SC.TabMenu>
      )}
    </>
  );
}
