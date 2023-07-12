import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
// import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJWT } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as Plus } from '../../assets/button/plus.svg';
import { GridContainer } from '../../common/grid/Grid.styled';
import Select from '../../common/select/Select';
import WalkCard from '../../components/card/walkCard/walkCard';
import { CardContainer } from '../../components/card/walkCard/walkCard.styled';
import Path from '../../routers/paths';
import { WalkFeedList } from '../../types/walkType';
import { SearchButton, SelectContainer } from './WalkMate.styled';

export function Component() {
  // 주소 값 받아오기
  const [zip, setZip] = useState('서울특별시');

  const accessToken = useReadLocalStorage<string | null>('accessToken');

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  const { data, refetch, isFetching, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery<WalkFeedList>({
      queryKey: ['walkmateList'],
      queryFn: ({ pageParam = 0 }) =>
        getServerDataWithJWT(
          `${SERVER_URL}walkmates/walks?openFilter=false&location=${zip}&page=${pageParam}&size=10`,
          accessToken,
        ),
      getNextPageParam: (lastPage, allPages) => {
        console.log(lastPage, allPages);
        // const nextPage = allPages.length + 1;
        // return lastPage.currentPage < lastPage.totalPage ? nextPage : undefined;
      },
    });

  const handleClickSearchAddress = () => {
    refetch();
  };

  return (
    <div className="mx-40 py-10 max-md:mx-20 ">
      <SelectContainer className="justify-end">
        <Select size="md" direction="row" setZip={setZip} />
        <SearchButton onClick={handleClickSearchAddress}>검색</SearchButton>
      </SelectContainer>
      <GridContainer>
        <Link to={Path.WalkPosting}>
          <CardContainer className="items-center justify-center">
            <Plus className=" w-8 h-8" />
          </CardContainer>
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
      </GridContainer>
    </div>
  );
}

Component.displayName = 'WalkMate';
