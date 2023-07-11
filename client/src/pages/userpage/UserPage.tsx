import { useParams } from 'react-router-dom';

export function Component() {
  const usersId = useParams();
  console.log(usersId);
  return <div>UserPage</div>;
}

Component.displayName = 'UserPage';
