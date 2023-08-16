import { useQueryClient, useMutation } from '@tanstack/react-query';
import { patchFormMuation } from '@/api/mutationfn';

interface PatchFormMutationProp {
  key: string[];
  successFn: () => void;
  errorFn: () => void;
}

export default function usePatchFormMutation({
  key,
  successFn,
  errorFn,
}: PatchFormMutationProp) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: patchFormMuation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      if (successFn) successFn();
    },
    onError: () => {
      if (errorFn) errorFn();
    },
  });
  return { mutate, isLoading };
}
