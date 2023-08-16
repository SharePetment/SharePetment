import { useQueryClient, useMutation } from '@tanstack/react-query';
import { postSubscribe } from '@/api/mutationfn';

interface MutationProp {
  keys: (string | number)[][];
}

export default function useSubscribeMutation({ keys }: MutationProp) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postSubscribe,
    onSuccess: () =>
      keys.map(key => queryClient.invalidateQueries({ queryKey: key })),
  });
  return { mutate };
}
