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
import { auth, db, storage } from "../../../firebase";

// utils
import { checkSize } from "../../../utils/CommonUtils";
import Textarea from "./Textarea";
import Form from "./Form";
import File from "./File";

//styles
import styles from "./postTweetForm.module.scss";

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
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
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
      <Form onSubmit={methods.handleSubmit(onSubmit)} className={styles.form}>
        <PostTweetTextarea />
        <PostTweetImage />
        <input
          type="submit"
          disabled={isLoading}
          value={isLoading ? "Posting..." : "Tweet"}
          style={{ cursor: "pointer" }}
          className={styles.button}
        />
      </Form>
    </FormProvider>
  );
};

const PostTweetTextarea = React.memo(() => {
  const { register } = useFormContext<TweetData>();
  return (
    <Textarea
      rows={5}
      maxLength={140}
      className={styles.textarea}
      {...register("tweet")}
    />
  );
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
    <File>
      <File.Label htmlFor="post-tweet-image" className={styles.button}>
        {image ? "Change " : "Add "} Photo
      </File.Label>
      <File.Input
        id="post-tweet-image"
        accept="image/*"
        onChange={handleChangeImage}
      />
    </File>
  );
});

export default PostTweetForm;
