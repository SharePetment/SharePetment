import { useQueryClient, useMutation } from '@tanstack/react-query';
import { MutationProp } from './mutationProp';
import { postFormMuation } from '@/api/mutationfn';

export default function usePostFormMutation({
  key,
  successFn,
  errorFn,
}: MutationProp) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: postFormMuation,
    onSuccess: () => {
      if (key)
        key.map(each => queryClient.invalidateQueries({ queryKey: [each] }));
      if (successFn) successFn();
    },
    onError: () => errorFn(),
  });
  return { mutate, isLoading };
}
