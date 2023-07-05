import { Link } from 'react-router-dom';
import { Btn } from './button.styled';

interface Prop {
  size: string; //lg, md, sm
  text: string;
  isgreen: string;
  path: string;
}

export default function Button({ size, text, isgreen, path }: Prop) {
  return (
    <Link to={path ? path : '#'}>
      <Btn isgreen={isgreen} size={size}>
        {text}
      </Btn>
    </Link>
  );
}
