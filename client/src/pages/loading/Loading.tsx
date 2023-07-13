import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import LoadingComponent from '../../components/loading/LoadingComponent';

export function Component() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', '');
  const [, setRefreshToken] = useLocalStorage<string | null>(
    'refreshToken',
    '',
  );
  const [, setMemberId] = useLocalStorage<string | null>('memberId', '');
  const [, setAnimalParents] = useLocalStorage<string | null>(
    'animalParents',
    'false',
  );

  useEffect(() => {
    if (searchParams.size > 0) {
      setAccessToken(searchParams.get('accessToken'));
      setRefreshToken(searchParams.get('refreshToken'));
      setMemberId(searchParams.get('memberId'));
      setAnimalParents(searchParams.get('animalParents'));

      const present = searchParams.get('present');
      if (present === 'true') setTimeout(() => navigate('/home'), 1000);
      else {
        const incodeName: string | null = searchParams.get('name');
        const name = incodeName ? decodeURIComponent(incodeName) : '';
        const email = searchParams.get('email');
        navigate('/info', {
          state: {
            name,
            email,
          },
        });
      }
    }
  }, [
    setAccessToken,
    setRefreshToken,
    setMemberId,
    searchParams,
    navigate,
    setAnimalParents,
  ]);

  return <LoadingComponent />;
}

Component.displayName = 'Loading';
