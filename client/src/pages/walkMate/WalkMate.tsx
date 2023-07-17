import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as Plus } from '../../assets/button/plus.svg';
import { GridContainer } from '../../common/grid/Grid.styled';
import Select from '../../common/select/Select';
import WalkCard from '../../components/card/walkCard/walkCard';
import { CardContainer } from '../../components/card/walkCard/walkCard.styled';
import LoadingComponent from '../../components/loading/LoadingComponent';
import Path from '../../routers/paths';
import { WalkFeed } from '../../types/walkType';
import { SearchButton, SelectContainer } from './WalkMate.styled';

export function Component() {
  // 주소 값 받아오기
  const [zip, setZip] = useState('서울');

  const accessToken = useReadLocalStorage<string | null>('accessToken');

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  const { ref, inView } = useInView();
  const {
    data,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    // isError,
  } = useInfiniteQuery<WalkFeed[]>({
    queryKey: ['walkmateList'],
    queryFn: ({ pageParam = 0 }) => {
      console.log(pageParam);
      return getServerDataWithJwt(
        `${SERVER_URL}/walkmates/walks?openFilter=false&location=${zip}&page=${pageParam}&size=10`,
        accessToken as string,
      );
    },

    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage, allPages);
      const len = allPages.length;
      const totalLength = allPages.length;
      return allPages[totalLength - 1].length === 0 ? undefined : len;
    },
    enabled: !!zip,
  });
  const handleClickSearchAddress = () => {
    refetch();
  };

  useEffect(() => {
    if (inView) {
      console.log('do');
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="mx-40 py-10 max-md:mx-20 ">
      <SelectContainer className="justify-end">
        <Select size="md" direction="row" setZip={setZip} />
        <SearchButton onClick={handleClickSearchAddress}>검색</SearchButton>
      </SelectContainer>
      <GridContainer>
        <Link to={Path.WalkPosting}>
          <CardContainer size="lg" className="items-center justify-center">
            <Plus className=" w-8 h-8" />
          </CardContainer>
        </Link>
        {Array.isArray(data?.pages[0]) &&
          data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.map(item => (
                <Link to={`/walkmate/${item.walkMatePostId}`}>
                  <WalkCard
                    size="lg"
                    time={item.time}
                    title={item.content}
                    friends={item.maximum}
                    location={item.location}
                    isclosed={`${item.open}`}
                    nickname={item.memberInfo.nickname}
                    imageURL={item.memberInfo.imageURL}
                  />
                </Link>
              ))}
            </React.Fragment>
          ))}
      </GridContainer>
      <div ref={ref}>
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load Newer'
          : 'Nothing more to load'}
      </div>
    </div>
  );
}

Component.displayName = 'WalkMate';
