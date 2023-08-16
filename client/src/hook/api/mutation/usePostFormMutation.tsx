import { useQueryClient, useMutation } from '@tanstack/react-query';
import { MutationProp } from './mutationProp';
import { postFormMuation } from '@/api/mutationfn';

export default function usePostFormMutation({
  keys,
  successFn,
  errorFn,
}: MutationProp) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: postFormMuation,
    onSuccess: () => {
      keys.map(key => queryClient.invalidateQueries({ queryKey: [key] }));
      successFn();
    },
    onError: () => errorFn(),
  });
  return { mutate, isLoading };
}
