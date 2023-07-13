import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { addComment } from '../../api/mutationfn';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as CommentIcon } from '../../assets/button/comment.svg';
import { ReactComponent as Delete } from '../../assets/button/delete.svg';
import { ReactComponent as Edit } from '../../assets/button/edit.svg';
import { ReactComponent as Calendar } from '../../assets/calendar.svg';
import { ReactComponent as Dog } from '../../assets/dog.svg';
import { ReactComponent as Chatlink } from '../../assets/link.svg';
import { ReactComponent as Pin } from '../../assets/pin.svg';
import Comment from '../../common/comment/Comment';
import LoadingComponent from '../../components/loading/LoadingComponent';
import { WalkFeed } from '../../types/walkType';
import {
  CommentButton,
  Divider,
  GatherMate,
  WalkInfo,
} from './WalkFeed.styled';

export function Component() {
  const { postId } = useParams();
  const memberId = useReadLocalStorage('memberId');
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  // 댓글 등록
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkFeed', postId] });
    },
  });

  type FormValues = {
    content: string;
  };

  const { register, handleSubmit, resetField } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = data => {
    const url = `${SERVER_URL}walkmates/comments/${postId}/${memberId}`;
    addCommentMutation.mutate({ ...data, url, accessToken });
    resetField('content');
  };

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<WalkFeed>({
    queryKey: ['walkFeed', postId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}walkmates/bywalk/${postId}`,
        accessToken as string,
      ),
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  const reversedData = data ? [...data.comments].reverse() : [];
  console.log(reversedData);

  return (
    <div className="w-[450px] max-sm:w-[320px] mx-auto mt-7">
      {data?.memberInfo?.memberId === memberId && (
        <div>
          <Edit />
          <Delete />
        </div>
      )}
      {/* 제목부분 */}
      <div className="flex items-center text-3xl font-[900] justify-start mb-7">
        <GatherMate isopen={data?.open ? 'true' : 'false'}>
          {data?.open ? '모집중' : '모집완료'}
        </GatherMate>
        <h2 className="ml-5">{data?.title}</h2>
      </div>
      {/* 산책정보 안내부분 */}
      <div className="grid grid-cols-2 gap-y-2 max-sm:grid-cols-1 mb-8">
        <WalkInfo>
          <Dog />
          <span>{data?.maximum}마리</span>
        </WalkInfo>
        <WalkInfo>
          <Calendar />
          <span>{data?.time}</span>
        </WalkInfo>
        <WalkInfo>
          <Pin />
          <span>{data?.location}</span>
        </WalkInfo>
        <WalkInfo>
          <Chatlink />
          <Link to={data?.chatURL as string}>
            <span>{data?.chatURL}</span>
          </Link>
        </WalkInfo>
      </div>
      {/* 본문 */}
      <div className="mb-7">{data?.content}</div>
      {/* 지도 이미지 부분 */}
      <div></div>
      <Divider />
      {/* 댓글 */}
      <div>
        <div className="flex items-center gap-1 text-deepgray mb-3">
          <CommentIcon className=" stroke-deepgray" />
          <span>댓글 {data?.comments?.length}</span>
        </div>
        {/* 댓글입력창 */}
        <form
          className="flex justify-between gap-2"
          onSubmit={handleSubmit(onSubmit)}>
          <input
            className=" w-full border-b border-lightgray bg-transparent outline-none"
            type="text"
            {...register('content', {
              required: '댓글 작성시 텍스트 필수',
            })}
          />
          <CommentButton>Comment</CommentButton>
        </form>
        {/* 댓글 렌더링 */}
        <ul>
          {reversedData.map(comment => {
            return (
              <Comment
                key={comment.walkMateCommentId}
                content={comment.content}
                createdAt={comment.createdAt}
                modifiedAt={comment.modifiedAt}
                memberInfo={comment.memberInfo}
                walkMateCommentId={comment.walkMateCommentId}
                walkMatePostId={postId}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Component.displayName = 'WalkFeed';
