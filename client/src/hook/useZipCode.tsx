import { useQuery } from '@tanstack/react-query';
import { getLocal } from '../api/queryfn.ts';

export interface Record {
  code: string;
  name: string;
}
export interface getData {
  regcodes: Record[];
}
interface Prop {
  key?: string;
  stoped?: boolean;
  zipPattern: string;
}

const useZipCode = ({ key, stoped, zipPattern }: Prop) => {
  const { data, isLoading } = useQuery<getData>({
    queryKey: key ? ['country', key] : ['country'],
    queryFn: () => getLocal(zipPattern),
    enabled: stoped ? !!zipPattern : false,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });
  return { data, isLoading };
};

export default useZipCode;
