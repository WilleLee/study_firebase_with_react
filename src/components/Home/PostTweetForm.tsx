import React, { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

type TweetData = {
  tweet: string;
  images: FileList | null;
};

const PostTweetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<TweetData>({
    defaultValues: { tweet: "", images: null },
  });

  const onSubmit = async (formData: TweetData) => {
    setIsLoading(true);
    console.log(formData);
    console.log(formData.images?.[0]);
    setIsLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <PostTweetTextarea />
        <PostTweetImage />
        <input
          type="submit"
          disabled={isLoading}
          value={isLoading ? "Posting..." : "Tweet"}
        />
      </form>
    </FormProvider>
  );
};

const PostTweetTextarea = React.memo(() => {
  const { register } = useFormContext<TweetData>();
  return <textarea rows={5} maxLength={140} {...register("tweet")} />;
});

const PostTweetImage = React.memo(() => {
  const { register, watch } = useFormContext<TweetData>();
  const { images } = watch();
  return (
    <>
      <label htmlFor="post-tweet-image">
        {!!images && images.length > 0 ? "Change " : "Add "} Photo
      </label>
      <input
        id="post-tweet-image"
        type="file"
        accept="image/*"
        {...register("images")}
      />
    </>
  );
});

export default PostTweetForm;
