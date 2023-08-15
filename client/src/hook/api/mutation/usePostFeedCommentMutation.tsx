import { useQueryClient, useMutation } from '@tanstack/react-query';
import { postFeedComment } from '@/api/mutationfn';

interface MutationProp {
  key: (string | number)[];
}

export default function usePostFeedCommentMutation({ key }: MutationProp) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postFeedComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
  return { mutate };
}
