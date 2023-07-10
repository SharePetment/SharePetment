import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import LoadingDog from '../../assets/illustration/loading-dog.png';
import { ReactComponent as LoadingText } from '../../assets/loading-text.svg';
import { ReactComponent as Loading } from '../../assets/loading.svg';
import { Container } from './Loading.styled';

export function Component() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [setAccessToken, setRefreshToken, setMemberId, searchParams]);

  return (
    <Container>
      <div className="relative pt-10">
        <Loading className="absolute bottom-44 right-24 " />
        <img src={LoadingDog} width={250} />
      </div>
      <LoadingText width={200} height={50} />
    </Container>
  );
}

Component.displayName = 'Loading';
