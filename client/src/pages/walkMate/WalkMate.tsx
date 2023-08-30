import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '@/api/queryfn.ts';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Plus } from '@/assets/button/plus.svg';
import { GridContainer } from '@/common/grid/Grid.styled.tsx';
import Select from '@/common/select/Select.tsx';
import { CardContainer } from '@/components/card/walk-card/walkCard.styled.tsx';
import LoadingComponent from '@/components/loading/LoadingComponent.tsx';
import NoticeServerError from '@/components/notice/NoticeServerError.tsx';
import WalkCardWrap from '@/components/walkmate-page/WalkCardWrap';
import UseInfinityScroll from '@/hook/api/query/useInfinityScroll';
import useMypageQuery from '@/hook/api/query/useMypageQuery';
import * as SC from '@/pages/walkMate/WalkMate.styled.tsx';
import Path from '@/routers/paths.ts';
import { WalkFeed } from '@/types/walkType.ts';

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
    <SC.WalkMateContainer>
      <SC.ButtonWrap>
        <Select size="md" direction="row" setZip={setZip} />
        <SC.SearchButton onClick={handleClickSearchAddress}>
          검색
        </SC.SearchButton>
        <SC.Wrap>
          <SC.FilterButton
            totalactive={showFilteredList}
            onClick={() => setShowFilteredList('total')}>
            전체
          </SC.FilterButton>
          <SC.FilterButton
            advertiseactive={showFilteredList}
            onClick={() => setShowFilteredList('advertise')}>
            모집 중
          </SC.FilterButton>
        </SC.Wrap>
      </SC.ButtonWrap>

      <GridContainer>
        <Link to={Path.WalkPosting} className="w-full">
          <CardContainer size="lg" className="items-center justify-center">
            <Plus className="w-8 h-8" />
          </CardContainer>
        </Link>

        {showFilteredList === 'total' ? (
          <>
            {Array.isArray(data?.pages[0]) &&
              data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.map(item => (
                    <WalkCardWrap item={item} />
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
                    <WalkCardWrap item={item} />
                  ))}
                </React.Fragment>
              ))}
          </>
        )}
      </GridContainer>
      <div ref={ref}></div>
    </SC.WalkMateContainer>
  );
}

Component.displayName = 'WalkMate';
