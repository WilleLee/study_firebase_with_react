import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import styles from "./tweet.module.scss";
import { deleteObject, ref } from "firebase/storage";

type Props = {
  username: string;
  image: string | null;
  tweet: string;
  userId: string;
  id: string;
};

const Tweet = ({ username, image, tweet, userId, id }: Props) => {
  const user = auth.currentUser;
  const handleClickDelete = async () => {
    const isConfirmed = confirm("Are you sure you want to delete?");
    if (!isConfirmed) return;
    if (user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (image) {
        const imageRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(imageRef);
      }
    } catch (err) {
      console.log(err);
    } finally {
      console.log("finally");
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.texts}>
        <div>
          <p>@{username}</p>
          <p>{tweet}</p>
        </div>
        {user?.uid === userId && (
          <button className={styles.delete_button} onClick={handleClickDelete}>
            delete
          </button>
        )}
      </div>
      {image && (
        <img
          onClick={() => window.open(image, "_blank")}
          src={image}
          height="108"
          width="108"
          alt=""
        />
      )}
    </div>
  );
};

export default Tweet;
