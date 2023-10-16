import React, { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";

//firebase
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "@/firebase";

// utils
import { checkSize } from "@/utils/CommonUtils";

type TweetData = {
  tweet: string;
  image: File | null;
};

const PostTweetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<TweetData>({
    defaultValues: { tweet: "", image: null },
  });

  const onSubmit: SubmitHandler<TweetData> = async (formData) => {
    const user = auth.currentUser;
    if (!user || isLoading || formData.tweet === "") return;
    try {
      setIsLoading(true);
      if (formData.image) {
        if (
          !checkSize(
            formData.image.size,
            1000000,
            "Image size should be less than 1MB"
          )
        )
          return;
      }
      const doc = await addDoc(collection(db, "tweets"), {
        tweet: formData.tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        image: null,
      });
      if (formData.image) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, formData.image);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          image: url,
        });
      }
      methods.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
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
          style={{ cursor: "pointer" }}
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
  const { watch, setValue } = useFormContext<TweetData>();
  const { image } = watch();
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    const file = files && files[0];
    if (!file) return;
    if (!checkSize(file.size, 1000000, "Image size should be less than 1MB"))
      return;
    setValue("image", file);
  };
  return (
    <>
      <label htmlFor="post-tweet-image" style={{ cursor: "pointer" }}>
        {image ? "Change " : "Add "} Photo
      </label>
      <input
        id="post-tweet-image"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChangeImage}
      />
    </>
  );
});

export default PostTweetForm;
