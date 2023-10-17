import React, { useEffect, useState } from "react";
import File from "../PostTweetForm/File";
import { SubmitHandler, useForm } from "react-hook-form";
import Textarea from "../PostTweetForm/Textarea";
import styles from "./editModal.module.scss";
import { checkSize } from "../../../utils/CommonUtils";
import { auth, db, storage } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface ModalProps extends React.AllHTMLAttributes<HTMLDivElement> {
  handleClose: () => void;
  tweet: string;
  image: string | null;
  id: string;
  userId: string;
}

type FormData = {
  tweet: string;
};

const EditModal = ({
  handleClose = () => {},
  tweet,
  image,
  id,
  userId,
  ...props
}: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { tweet },
  });

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!image) return;
    setPreviewSrc(image);
  }, [image]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    const file = files && files[0];
    if (!file) return;
    if (!checkSize(file.size, 1000000, "Image size should be less than 1MB"))
      return;
    setFile(file);
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleEdit: SubmitHandler<FormData> = async (formData) => {
    console.log(formData);
    console.log(file);
    const user = auth.currentUser;
    if (formData.tweet === "" || !user || isLoading || user?.uid !== userId)
      return;
    try {
      setIsLoading(true);
      if (file) {
        if (
          !checkSize(file.size, 1000000, "Image size should be less than 1MB")
        )
          return;
      }
      await updateDoc(doc(db, "tweets", id), {
        tweet: formData.tweet,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "tweets", id), {
          image: url,
        });
      }
      alert("Tweet edited successfully");
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper} onClick={handleClose} {...props}>
      <div
        className={styles.content_wrapper}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Textarea
          rows={5}
          maxLength={140}
          className={styles.textarea}
          {...register("tweet")}
        />
        <div className={styles.controls}>
          {previewSrc ? (
            <File>
              <File.Label className={styles.preview} htmlFor="edit-tweet-image">
                <img src={previewSrc} alt="" />
              </File.Label>
              <File.Input
                id="edit-tweet-image"
                accept="image/*"
                onChange={handleChangeFile}
              />
            </File>
          ) : (
            <div />
          )}
          <button
            disabled={isLoading}
            className={styles.button}
            onClick={handleSubmit(handleEdit)}
          >
            {isLoading ? "Editing..." : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
