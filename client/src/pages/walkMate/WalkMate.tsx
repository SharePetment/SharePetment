import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '@/api/queryfn.ts';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Plus } from '@/assets/button/plus.svg';
import { GridContainer } from '@/common/grid/Grid.styled.tsx';
import Select from '@/common/select/Select.tsx';
import { CardContainer } from '@/components/card/walk-card/walkCard.styled.tsx';
import WalkCard from '@/components/card/walk-card/walkCard.tsx';
import LoadingComponent from '@/components/loading/LoadingComponent.tsx';
import NoticeServerError from '@/components/notice/NoticeServerError.tsx';
import UseInfinityScroll from '@/hook/api/query/useInfinityScroll';
import useMypageQuery from '@/hook/api/query/useMypageQuery';
import {
  FilterButton,
  SearchButton,
} from '@/pages/walkMate/WalkMate.styled.tsx';
import Path from '@/routers/paths.ts';
import { WalkFeed } from '@/types/walkType.ts';
import { changeDateFormat } from '@/util/changeDateFormat.ts';

export function Component() {
  const navigate = useNavigate();
  // 주소 값 받아오기
  const [zip, setZip] = useState('서울');
  // 필터링 상태
  const [showFilteredList, setShowFilteredList] = useState('total');

  const accessToken = useReadLocalStorage<string | null>('accessToken');

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  const { data, isLoading, fetchNextPage, isError, ref, inView, refetch } =
    UseInfinityScroll<WalkFeed>({
      queryKey: `walkmateList`,
      fn: getServerDataWithJwt,
      enabledValue: accessToken,
      zip,
    });

  const {
    data: advertiseData,
    isLoading: advertiseIsLoading,
    refetch: advertiseRefetch,
    fetchNextPage: advertiseFetchNextPage,
    isError: advertiseIsError,
  } = UseInfinityScroll<WalkFeed>({
    queryKey: `walkmateListAdvertise`,
    fn: getServerDataWithJwt,
    enabledValue: accessToken,
    zip,
  });

  const handleClickSearchAddress = () => {
    refetch();
    advertiseRefetch();
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
      advertiseFetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // 화면 분기 처리
  // 유저 login, pet 여부 검사
  const { data: userData, isLoading: userLoading } = useMypageQuery({
    url: `${SERVER_URL}/members`,
    accessToken,
  });

  useEffect(() => {
    if (!userLoading && !userData?.animalParents) {
      navigate(Path.Home);
    }
  }, [userData, navigate, userLoading]);

  if (isError || advertiseIsError) {
    return (
      <div className=" mt-40">
        <NoticeServerError />
      </div>
    );
  }

  if (isLoading || advertiseIsLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="max-w-[1028px] mx-auto mt-10 px-6 max-sm:flex max-sm:flex-col max-sm:items-center">
      <div className="grid grid-cols-[max-content_max-content] gap-y-6 gap-x-4 max-sm:gap-x-2">
        <Select size="md" direction="row" setZip={setZip} />
        <SearchButton onClick={handleClickSearchAddress}>검색</SearchButton>
        <div className="flex gap-4 max-sm:gap-2">
          <FilterButton
            totalactive={showFilteredList}
            onClick={() => setShowFilteredList('total')}>
            전체
          </FilterButton>
          <FilterButton
            advertiseactive={showFilteredList}
            onClick={() => setShowFilteredList('advertise')}>
            모집 중
          </FilterButton>
        </div>
      </div>

      <GridContainer>
        <Link to={Path.WalkPosting} className="w-full">
          <CardContainer size="lg" className="items-center justify-center">
            <Plus className=" w-8 h-8" />
          </CardContainer>
        </Link>

        {showFilteredList === 'total' ? (
          <>
            {Array.isArray(data?.pages[0]) &&
              data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.map(item => (
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
                  ))}
                </React.Fragment>
              ))}
          </>
        ) : (
          <>
            {Array.isArray(advertiseData?.pages[0]) &&
              advertiseData?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.map(item => (
                    <Link
                      to={`${Path.WalkMate}/${item.walkMatePostId}`}
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
                  ))}
                </React.Fragment>
              ))}
          </>
        )}
      </GridContainer>
      <div ref={ref}></div>
    </div>
  );
}

Component.displayName = 'WalkMate';
