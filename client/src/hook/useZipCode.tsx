import { useQuery } from '@tanstack/react-query';
import { getLocal } from '@/api/queryfn.ts';

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
  type: 'country' | 'city' | 'village';
}

const useZipCode = ({ key, stoped, zipPattern, type }: Prop) => {
  const { data, isLoading } = useQuery<getData>({
    queryKey: key ? ['country', key] : ['country'],
    queryFn: () => getLocal(zipPattern),
    enabled: stoped ? !!zipPattern : type === 'country' ? true : false,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });
  return { data, isLoading };
};

export default useZipCode;
