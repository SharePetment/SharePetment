import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import {
  addComment,
  deleteWalkFeed,
  patchWalkStatus,
} from '../../api/mutationfn';
import { getServerDataWithJwt } from '../../api/queryfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as CommentIcon } from '../../assets/button/comment.svg';
import { ReactComponent as Delete } from '../../assets/button/delete.svg';
import { ReactComponent as Edit } from '../../assets/button/edit.svg';
import { ReactComponent as Calendar } from '../../assets/calendar.svg';
import { ReactComponent as Dog } from '../../assets/dog.svg';
import { ReactComponent as Chatlink } from '../../assets/link.svg';
import { ReactComponent as ArrowLeft } from '../../assets/mobile/arrow-left.svg';
import { ReactComponent as Pin } from '../../assets/pin.svg';
import Comment from '../../common/comment/Comment.tsx';
import Popup from '../../common/popup/Popup.tsx';
import LoadingComponent from '../../components/loading/LoadingComponent.tsx';
import ShowMap from '../../components/map-show/ShowMap.tsx';
import NoticeServerError from '../../components/notice/NoticeServerError.tsx';
import { MemberIdContext, State } from '../../store/Context.tsx';
import { UserInfo } from '../../types/userType.ts';
import { WalkFeed } from '../../types/walkType.ts';
import { changeDateFormat } from '../../util/changeDateFormat.ts';
import {
  CommentButton,
  Divider,
  GatherMate,
  WalkInfo,
} from './WalkFeed.styled';

export function Component() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { memberId: userId } = useContext(MemberIdContext) as State;
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  // 요청 실패 팝업
  const [isOpen, setIsOpen] = useState<[boolean, string]>([false, '']);

  // 댓글 등록
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkFeed', postId] });
      queryClient.invalidateQueries({ queryKey: ['walkmateList'] });
    },
    onError: () => setIsOpen([true, '댓글 생성에 실패했습니다.']),
  });

  type FormValues = {
    content: string;
  };

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<FormValues> = data => {
    data = {
      content: data.content.trim(),
    };
    const url = `${SERVER_URL}/walkmates/comments/${postId}`;
    addCommentMutation.mutate({ ...data, url, accessToken });
    resetField('content');
  };

  const queryClient = useQueryClient();

  // 산책 게시글 가지고 오기
  const {
    data,
    isLoading: isFeedLoading,
    isError: isFeedError,
  } = useQuery<WalkFeed>({
    queryKey: ['walkFeed', postId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/walkmates/bywalk/${postId}`,
        accessToken as string,
      ),
    onSuccess(data) {
      setAddress((data?.location as string) + ' ' + data?.mapURL.split(' ')[2]);
      setLat(data?.mapURL.split(' ')[0]);
      setLng(data?.mapURL.split(' ')[1]);
    },
  });

  const reversedData = data ? [...data.comments].reverse() : [];

  // 모집 변경
  const walkStatusMutation = useMutation({
    mutationFn: patchWalkStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkFeed', postId] });
    },
    onError: () => setIsOpen([true, '모집 변경에 실패했습니다.']),
  });

  const handleWalkStatus = () => {
    walkStatusMutation.mutate({
      url: `${SERVER_URL}/walkmates/openstatus/${!data?.open}/${
        data?.walkMatePostId
      }`,
      accessToken: accessToken as string,
    });
  };

  // 게시글 수정
  const handleWalkFeedEdit = () => {
    // 수정 페이지로 이동
    navigate(`/walk-posting/${data?.walkMatePostId}`);
  };

  // 게시글 삭제
  const walkDeleteMutation = useMutation({
    mutationFn: deleteWalkFeed,
    onSuccess: () => {
      navigate('/walkmate');
    },
    onError: () => setIsOpen([true, '게시글 삭제에 실패했습니다.']),
  });

  const [isDeleted, setIsDeleted] = useState(false);
  const handleWalkFeedDeletePopUp = () => {
    setIsDeleted(true);
  };
  const handleWalkFeedDelete = () => {
    walkDeleteMutation.mutate({
      url: `${SERVER_URL}/walkmates/${data?.walkMatePostId}`,
      accessToken: accessToken as string,
    });
  };

  const { data: userData, isLoading } = useQuery<UserInfo>({
    queryKey: ['myPage'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
  });

  useEffect(() => {
    if (!isLoading && !userData?.animalParents) {
      navigate('/home');
    }
  }, [userData, navigate, isLoading]);

  // 지도 그리기
  // 위도, 경도, 주소
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  if (isFeedError)
    return (
      <div className="w-screen h-[550px] flex justify-center items-center">
        <NoticeServerError />
      </div>
    );

  if (
    isFeedLoading ||
    walkDeleteMutation.isLoading ||
    walkStatusMutation.isLoading
  )
    return <LoadingComponent />;
  else {
    return (
      <>
        <div className="w-[500px] max-sm:w-[320px] mx-auto mt-7">
          <ArrowLeft
            className="hidden max-sm:block w-6 h-6 cursor-pointer"
            onClick={() => navigate('/walkmate')}
          />
          {`${data?.memberInfo?.memberId}` === userId && (
            <div className="flex justify-end gap-4 items-center">
              <button
                className="bg-deepgreen px-2 py-1 rounded-md text-white"
                onClick={handleWalkStatus}>
                모집변경
              </button>
              <Edit
                className="cursor-pointer"
                onClick={handleWalkFeedEdit}
                stroke="black"
              />
              <Delete
                className="cursor-pointer"
                onClick={handleWalkFeedDeletePopUp}
                stroke="black"
              />
            </div>
          )}
          {/* 제목부분 */}
          <div className="flex items-baseline gap-3 text-3xl font-[900] justify-start mb-7 mt-3">
            <GatherMate isopen={data?.open ? 'true' : 'false'}>
              {data?.open ? '모집중' : '모집완료'}
            </GatherMate>
            <h2 className="max-sm:text-xl">{data?.title}</h2>
          </div>
          {/* 산책정보 안내부분 */}
          <div className="grid grid-cols-2 gap-y-2 max-sm:grid-cols-1 mb-8">
            <WalkInfo>
              <Dog />
              <span>{data?.maximum}마리</span>
            </WalkInfo>
            <WalkInfo>
              <Calendar />
              <span>{changeDateFormat(data?.time as string)}</span>
            </WalkInfo>
            <WalkInfo>
              <Pin />
              <span>{address}</span>
            </WalkInfo>
            <WalkInfo>
              <Chatlink className=" shrink-0" />
              <a href={data?.chatURL as string} target="_blank">
                <span className=" break-all">{data?.chatURL}</span>
              </a>
            </WalkInfo>
          </div>
          {/* 본문 */}
          <div className="mb-7">{data?.content}</div>
          {/* 지도 이미지 부분 */}
          <ShowMap address={address} lat={lat} lng={lng} />

          <Divider />
          {/* 댓글 */}
          <div className="mt-5">
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
                  maxLength: {
                    value: 100,
                    message: '100자 이내로 입력해주세요 :)',
                  },
                  validate: value => value.trim().length !== 0 || '공백만 안됨',
                })}
              />

              <CommentButton
                disabled={!!errors.content?.message}
                className={
                  errors.content?.message === undefined
                    ? 'bg-deepgreen'
                    : 'bg-lightgray'
                }>
                Comment
              </CommentButton>
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
        <>
          {isDeleted && (
            <Popup
              countbtn={2}
              title="정말로 삭제하시겠습니까?"
              btnsize={['md', 'md']}
              isgreen={['true', 'false']}
              buttontext={['삭제', '취소']}
              popupcontrol={() => {
                setIsDeleted(false);
              }}
              handler={[
                handleWalkFeedDelete,
                () => {
                  setIsDeleted(false);
                },
              ]}
            />
          )}
          {isOpen[0] && (
            <Popup
              countbtn={1}
              title={isOpen[1]}
              btnsize={['md']}
              isgreen={['true']}
              buttontext={['확인']}
              popupcontrol={() => {
                setIsOpen([false, '']);
              }}
              handler={[
                () => {
                  setIsOpen([false, '']);
                },
              ]}
            />
          )}
        </>
      </>
    );
  }
}

Component.displayName = 'WalkFeed';
