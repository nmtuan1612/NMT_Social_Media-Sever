import CommentModel from "../Models/commentModel.js";

// Comment to post
export const createComment = async (req, res) => {
  // const { postId } = req.params.id;

  // const post = PostModel.findById(postId);
  const newComment = new CommentModel(req.body);

  try {
    const comment = await newComment.save();
    // await post.updateOne({ $push: { comments: comment._id } });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get comment
export const getComment = async (req, res) => {
    const commentId = req.params.id;

    try {
        const comment = await CommentModel.findById(commentId);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json(error);
    }
}

// Get post's comments
export const getPostComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const postComments = await CommentModel.find({ postId: postId }).sort({ createdAt: 1 });
    res.status(200).json(postComments);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Like post's comment

export const likePostComment = async (req, res) => {
    const commentId = req.params.id;
    const { userId } = req.body;

    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment.likes.includes(userId)) {
            const updatedComment = await CommentModel.findByIdAndUpdate(commentId, { $push: { likes: userId }}, { new: true });
            res.status(200).json(updatedComment);
        } else {
            const updatedComment = await CommentModel.findByIdAndUpdate(commentId, { $pull: { likes: userId }}, { new: true });
            res.status(200).json(updatedComment);
        }
    } catch (error) {
        console.log(error);
    }
}