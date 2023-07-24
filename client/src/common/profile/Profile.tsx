import { ProfileImage } from './Profile.styled.tsx';

interface ProfileProps {
  size: 'lg' | 'md' | 'sm';
  isgreen: string;
  url: string | undefined;
}

export default function Profile({ size, isgreen, url }: ProfileProps) {
  return <ProfileImage size={size} isgreen={isgreen} src={url} />;
}
