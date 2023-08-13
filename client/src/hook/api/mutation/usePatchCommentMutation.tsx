import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchComment } from '@/api/mutationfn';

type Prop = {
  id: string | number | undefined;
  uniqueKey: string;
  setIsCommentError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UsePatchCommentMutation({
  id,
  uniqueKey,
  setIsEdited,
  setIsCommentError,
}: Prop) {
  const queryClient = useQueryClient();
  // mutation
  const patchCommentMutation = useMutation({
    mutationFn: patchComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [uniqueKey, id] });
      setIsEdited(false);
    },
    onError: () => {
      setIsCommentError(true);
    },
  });
  return patchCommentMutation;
}
