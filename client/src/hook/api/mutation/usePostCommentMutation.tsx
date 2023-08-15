import { useQueryClient, useMutation } from '@tanstack/react-query';
import { MutationProp } from './mutationProp';
import { postComment } from '@/api/mutationfn';

export default function usePostCommentMutation({
  keys,
  errorFn,
}: MutationProp) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      if (keys)
        keys.map(key =>
          queryClient.invalidateQueries({
            queryKey: key,
          }),
        );
    },
    onError: () => errorFn(),
  });
  return { mutate };
}
