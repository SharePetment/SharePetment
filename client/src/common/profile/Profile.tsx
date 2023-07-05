import { ProfileImage } from './Profile.styled';

interface ProfileProps {
  size: 'lg' | 'md' | 'sm';
  isgreen: string;
}

export default function Profile({ size, isgreen }: ProfileProps) {
  return <ProfileImage size={size} isgreen={isgreen} />;
}
