// import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { getWalkmateList } from '../../api/queryfn';
import { ReactComponent as Plus } from '../../assets/button/plus.svg';
import { GridContainer } from '../../common/grid/Grid.styled';
import Select from '../../common/select/Select';
import WalkCard from '../../components/card/walkCard/walkCard';
import { CardContainer } from '../../components/card/walkCard/walkCard.styled';
import Path from '../../routers/paths';

export function Component() {
  // 주소 값 받아오기
  const [zip, setZip] = useState('');
  console.log(zip);

  // const { data: walkMateData } = useQuery({
  //   queryKey: ['walkmateList'],
  //   queryFn: () => getWalkmateList(),
  // });

  return (
    <div className="mx-40 py-10 max-md:mx-20 ">
      <Select size="md" direction="row" setZip={setZip} />
      <GridContainer>
        <Link to={Path.WalkPosting}>
          <CardContainer className="items-center justify-center">
            <Plus className=" w-8 h-8" />
          </CardContainer>
        </Link>
        <Link to={Path.WalkFeed}>
          <CardContainer />
        </Link>
      </GridContainer>
    </div>
  );
}

Component.displayName = 'WalkMate';
