import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteMutation } from '@/api/mutationfn';

interface DeleteMutationProp {
  keys?: (string | number)[][];
  successFn?: () => void;
  errorFn?: () => void;
}

export default function useDeleteMutation({
  successFn,
  keys,
  errorFn,
}: DeleteMutationProp) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteMutation,
    onSuccess: () => {
      if (keys)
        keys.map(key => queryClient.invalidateQueries({ queryKey: key }));
      if (successFn) successFn();
    },
    onError: () => {
      if (errorFn) errorFn();
    },
  });
  return { mutate, isLoading };
}
