import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMutation } from '@/api/mutationfn';

type Prop = {
  id: string | number | undefined;
  uniqueKey: string;
  setIsDeletError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UseDeleteCommentMutation({
  id,
  uniqueKey,
  setIsDeletError,
}: Prop) {
  const queryClient = useQueryClient();
  const deleteCommentMutaion = useMutation({
    mutationFn: deleteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [uniqueKey, id] });
    },
    onError: () => {
      setIsDeletError(true);
    },
  });
  return deleteCommentMutaion;
}
