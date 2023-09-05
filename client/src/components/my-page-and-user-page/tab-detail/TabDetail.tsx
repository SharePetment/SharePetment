import { InfiniteData } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';
import NoCommentCat from '@/assets/illustration/nocomment-cat.png';
import NoCommentCatWebp from '@/assets/illustration/nocomment-cat.webp';
import WalkCard from '@/components/card/walk-card/walkCard';
import * as SC from '@/components/my-page-and-user-page/tab-detail/tabDetail.styled';
import NoticeNoData from '@/components/notice/NoticeNoData';
import NoticeOnlyOwner from '@/components/notice/NoticeOnlyOwner';
import NoticeServerError from '@/components/notice/NoticeServerError';
import * as SCNOTFOUND from '@/pages/notFound/NotFound.styled';
import Path from '@/routers/paths';
import { CommentProp } from '@/types/commentType';
import { Feed } from '@/types/feedTypes';
import { WalkFeed } from '@/types/walkType';
import { changeDateFormat } from '@/util/changeDateFormat';
import changeTime from '@/util/changeTime';

type Prop = {
  feedData?: InfiniteData<Feed[]>;
  walkData?: InfiniteData<WalkFeed[]>;
  commentData?: CommentProp[];
  isPet?: boolean | undefined;
  type: 'comment' | 'feed' | 'walkFeed';
  isError: boolean;
  ref?: (node?: Element | null | undefined) => void;
};

export default function TabDetail({
  feedData,
  walkData,
  commentData,
  isPet,
  type,
  isError,
  ref,
}: Prop) {
  // 에러가 있을 시
  if (isError) {
    return <NoticeServerError />;
  }

  // pet 등록이 안되어 있을시
  if (!isPet && (type === 'walkFeed' || type === 'comment')) {
    return <NoticeOnlyOwner />;
  }

  return (
    <>
      {type === 'feed' && (
        <div>
          {feedData?.pages[0].length === 0 ? (
            <>
              <NoticeNoData url="feed-posting" />
            </>
          ) : (
            <>
              <SC.GridContainerFeed>
                {feedData?.pages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page.map(item => (
                      <Link
                        to={`${Path.Home}/${item.feedId}`}
                        key={item.feedId}>
                        <img
                          className="w-full h-[180px] rounded-[28px] object-cover border hover:scale-105 transition-all delay-75"
                          src={
                            item.images[0] ? item.images[0].uploadFileURL : ''
                          }
                        />
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
              </SC.GridContainerFeed>
              <div ref={ref}></div>
            </>
          )}
        </div>
      )}

      {type === 'walkFeed' && (
        <div className="flex justify-center">
          {!walkData?.pages[0]?.length ? (
            <NoticeNoData url="walk-posting" />
          ) : (
            <div>
              <SC.GridContainerWalk>
                {walkData?.pages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page.map(item => (
                      <Link
                        to={`${Path.WalkMate}/${item.walkMatePostId}`}
                        key={item.walkMatePostId}>
                        <WalkCard
                          size="sm"
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
                    ))}
                  </React.Fragment>
                ))}
              </SC.GridContainerWalk>
              <div ref={ref}></div>
            </div>
          )}
        </div>
      )}

      {type === 'comment' && (
        <div className="w-[300px]">
          {!commentData?.length ? (
            <div className="flex flex-col items-center justify-center">
              <SCNOTFOUND.ErrorText>
                아직 댓글을 단 산책 게시물이 없어요.
              </SCNOTFOUND.ErrorText>
              <picture>
                <source srcSet={NoCommentCatWebp} type="image/webp" />
                <img src={NoCommentCat} className=" w-60" alt="LyingDownDog" />
              </picture>
            </div>
          ) : (
            commentData?.map(item => (
              <Link
                to={`${Path.WalkMate}/${item.walkMatePostId}`}
                key={item.walkMateCommentId}>
                <SC.CommentList>
                  <span className=" whitespace-nowrap overflow-hidden text-ellipsis ">
                    {item.content}
                  </span>
                  <time className="text-deepgray text-xs flex-shrink-0">
                    {changeTime(item.createdAt)}
                  </time>
                </SC.CommentList>
              </Link>
            ))
          )}
        </div>
      )}
    </>
  );
}
