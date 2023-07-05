import { ProfileImage } from './Profile.styled';

interface ProfileProps {
  size: 'lg' | 'md' | 'sm';
  isgreened: string;
}

export default function Profile({ size, isgreened }: ProfileProps) {
  return <ProfileImage size={size} isgreened={isgreened} />;
}
