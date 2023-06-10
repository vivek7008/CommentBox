import React, { useState, useEffect } from 'react';

const CommentBox = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Load comments from local storage when component mounts
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  useEffect(() => {
    // Save comments to local storage whenever the 'comments' state changes
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    if (comment.trim() !== '') {
      const newComment = { text: comment, replies: [] };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const handleReplySubmit = (event, index) => {
    event.preventDefault();

    if (comment.trim() !== '') {
      const newReply = { text: comment, replies: [] };
      const updatedComments = [...comments];
      updatedComments[index].replies.push(newReply);
      setComments(updatedComments);
      setComment('');
    }
  };

  const handleEditComment = (event, index) => {
    event.preventDefault();

    const updatedComment = prompt('Edit the comment:', comments[index].text);

    if (updatedComment !== null) {
      const updatedComments = [...comments];
      updatedComments[index].text = updatedComment;
      setComments(updatedComments);
    }
  };

  const renderReplies = (replies, level = 0) => {
    return replies.map((reply, index) => (
      <div key={index} style={{ marginLeft: `${level * 20}px` }}>
        {reply.text}
        <button onClick={(event) => handleEditComment(event, index)}>Edit</button>
        <button onClick={(event) => handleReplySubmit(event, index)}>Reply</button>
        {renderReplies(reply.replies, level + 1)}
      </div>
    ));
  };

  const renderComments = () => {
    return comments.map((comment, index) => (
      <div key={index}>
        {comment.text}
        <button onClick={(event) => handleEditComment(event, index)}>Edit</button>
        <button onClick={(event) => handleReplySubmit(event, index)}>Reply</button>
        {renderReplies(comment.replies, 1)}
      </div>
    ));
  };

  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <textarea value={comment} onChange={handleCommentChange} placeholder="Enter your comment"></textarea>
        <button type="submit">Add Comment</button>
      </form>
      <div>
        {renderComments()}
      </div>
    </div>
  );
};

export default CommentBox;
