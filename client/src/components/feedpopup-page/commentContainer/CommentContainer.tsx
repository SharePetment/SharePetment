import * as SC from './CommentContainer.styled';
import Comment from '@/common/comment/Comment';
import FeedInput from '@/common/input/feedInput/FeedInput';
import { Feed } from '@/types/feedTypes';

interface CommentContainerProp {
  data: Feed;
  setIsCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<[boolean, string]>>;
}

export default function CommentContainer({
  data,
  setIsCommentOpen,
  setIsOpen,
}: CommentContainerProp) {
  return (
    <SC.Container
      onClick={e => {
        if (e.target === e.currentTarget) setIsCommentOpen(false);
      }}>
      <SC.Wrap>
        <SC.CommentBox>
          {data.feedComments !== null &&
            Array.isArray(data.feedComments) &&
            data.feedComments.map(comment => (
              <>
                <Comment
                  key={comment.feedCommentsId}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  modifiedAt={comment.modifiedAt}
                  memberInfo={comment.memberInfo}
                  feedPostId={data.feedId}
                  feedCommentsId={comment.feedCommentsId}
                  type="feed"
                />
              </>
            ))}
        </SC.CommentBox>
        <FeedInput feedid={data.feedId} blankhandler={setIsOpen} />
      </SC.Wrap>
    </SC.Container>
  );
}
