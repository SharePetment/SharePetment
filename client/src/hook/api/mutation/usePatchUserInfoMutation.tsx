import { useMutation } from '@tanstack/react-query';
import { MutationProp } from './mutationProp';
import { patchUserInfo } from '@/api/mutationfn';

export default function usePatchUserInfoMutation({
  successFn,
  errorFn,
}: MutationProp) {
  const { mutate } = useMutation({
    mutationFn: patchUserInfo,
    onSuccess: () => {
      if (successFn) successFn();
    },
    onError: () => errorFn(),
  });
  return { mutate };
}
