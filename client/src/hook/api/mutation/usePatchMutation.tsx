import { useQueryClient, useMutation } from '@tanstack/react-query';
import { MutationProp } from './mutationProp';
import { patchMutation } from '@/api/mutationfn';

export default function usePatchMutation({
  keys,
  successFn,
  errorFn,
}: MutationProp) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: patchMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys });
      if (successFn) successFn();
    },
    onError: () => errorFn(),
  });
  return { mutate, isLoading };
}
