import { ProfileContainer } from './Profile.styled';

export interface ProfileProps {
  size: string;
  url: string;
  isgreened: string;
}

export default function Profile({ size, url, isgreened }: ProfileProps) {
  return <ProfileContainer size={size} url={url} isgreened={isgreened} />;
}
