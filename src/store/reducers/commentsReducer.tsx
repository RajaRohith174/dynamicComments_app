import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type Comment = {
  id: number;
  name: string;
  comment: string;
  time: string;
};

type Reply = {
  id: number;
  commentId: number; // Which comment this reply belongs to
  name: string;
  reply: string;
  time: string;
};

type CommentsState = {
  comments: Comment[];
  replies: Reply[];
};

const initialState: CommentsState = {
  comments: [],
  replies: [],
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },
    addReply(
      state,
      action: PayloadAction<{commentId: number; reply: Comment}>,
    ) {
      const {commentId, reply} = action.payload;
      const comment = state.comments.find(c => c.id === commentId);
      if (comment) {
        comment.replies.push(reply);
      }
    },
    deleteComment(state, action: PayloadAction<number>) {
      state.comments = state.comments.filter(c => c.id !== action.payload);
    },
    deleteReply(
      state,
      action: PayloadAction<{commentId: number; replyId: number}>,
    ) {
      const {commentId, replyId} = action.payload;
      const comment = state.comments.find(c => c.id === commentId);
      if (comment) {
        comment.replies = comment.replies.filter(r => r.id !== replyId);
      }
    },
    editComment(state, action: PayloadAction<Comment>) {
      const updatedComment = action.payload;
      const index = state.comments.findIndex(c => c.id === updatedComment.id);
      if (index !== -1) {
        state.comments[index] = updatedComment;
      }
    },

    sortComments: state => {
      state.comments.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      );
    },
  },

  extraReducers: builder => {
    builder;
  },
});

export const {
  addComment,
  addReply,
  editComment,
  // editReply,
  deleteComment,
  deleteReply,
  sortComments,
} = commentSlice.actions;
export default commentSlice.reducer;
