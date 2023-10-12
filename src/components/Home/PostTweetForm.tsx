const PostTweetForm = () => {
  return (
    <form>
      <textarea placeholder="What is happening?" style={{ resize: "none" }} />
      <label htmlFor="post-tweet-image">add photo</label>
      <input id="post-tweet-image" type="file" accept="image/*" />
      <input type="submit" value="Tweet" />
    </form>
  );
};

export default PostTweetForm;
