import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
// import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as Plus } from '../../assets/button/plus.svg';
import { GridContainer } from '../../common/grid/Grid.styled';
import Select from '../../common/select/Select';
// import WalkCard from '../../components/card/walkCard/walkCard';
import { CardContainer } from '../../components/card/walkCard/walkCard.styled';
import LoadingComponent from '../../components/loading/LoadingComponent';
import Path from '../../routers/paths';
// import { WalkFeedList } from '../../types/walkType';
import { SearchButton } from './WalkMate.styled';

export function Component() {
  // 주소 값 받아오기
  const [zip, setZip] = useState('서울');

  const accessToken = useReadLocalStorage<string | null>('accessToken');

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  // const {
  //   data,
  //   isLoading,
  //   refetch,
  //   // isFetching,
  //   // isError,
  //   // hasNextPage,
  //   // fetchNextPage,
  // } = useInfiniteQuery<WalkFeedList>({
  //   queryKey: ['walkmateList'],
  //   queryFn: ({ pageParam = 0 }) =>
  //     getServerDataWithJwt(
  //       `${SERVER_URL}/walkmates/walks?openFilter=false&location=${zip}&page=${pageParam}&size=10`,
  //       accessToken as string,
  //     ),
  //   getNextPageParam: (lastPage, allPages) => {
  //     console.log(lastPage, allPages);
  //     // const nextPage = allPages.length + 1;
  //     // return lastPage.currentPage < lastPage.totalPage ? nextPage : undefined;
  //   },
  // });

  const { isLoading } = useQuery({
    queryKey: ['walkmateLsit'],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/walkmates/walks?openFilter=false&location=${zip}&page=0&size=10`,
        accessToken as string,
      ),
  });

  const handleClickSearchAddress = () => {
    // refetch();
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="mt-10 flex flex-col justify-center">
      <div className=" flex justify-end max-sm:flex-col items-center gap-4 pr-6">
        <Select size="md" direction="row" setZip={setZip} />
        <SearchButton onClick={handleClickSearchAddress}>검색</SearchButton>
      </div>
      <GridContainer>
        <Link to={Path.WalkPosting}>
          <CardContainer size="lg" className="items-center justify-center">
            <Plus className=" w-8 h-8" />
          </CardContainer>
        </Link>
      </GridContainer>
    </div>
  );
}

Component.displayName = 'WalkMate';
