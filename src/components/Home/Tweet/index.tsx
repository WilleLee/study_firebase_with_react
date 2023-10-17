import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import styles from "./tweet.module.scss";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import { createPortal } from "react-dom";
import EditModal from "./EditModal";

type Props = {
  username: string;
  image: string | null;
  tweet: string;
  userId: string;
  id: string;
};

const Tweet = ({ username, image, tweet, userId, id }: Props) => {
  const [isShowModal, setIsShowModal] = useState(false);
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
      {isShowModal
        ? createPortal(
            <EditModal
              handleClose={() => setIsShowModal(false)}
              tweet={tweet}
              image={image}
              id={id}
              userId={userId}
            />,
            document.body
          )
        : null}
      <div className={styles.texts}>
        <div>
          <p>@{username}</p>
          <p>{tweet}</p>
        </div>
        {user?.uid === userId && (
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${styles.delete}`}
              onClick={handleClickDelete}
            >
              Delete
            </button>
            <button
              className={`${styles.button} ${styles.edit}`}
              onClick={() => setIsShowModal(true)}
            >
              Edit
            </button>
          </div>
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

// interface ModalProps extends React.AllHTMLAttributes<HTMLDivElement> {
//   handleClose: () => void;
//   tweet: string;
//   image: string | null;
//   id: string;
//   userId: string;
// }

// const EditModal = ({
//   handleClose = () => {},
//   tweet,
//   image,
//   id,
//   userId,
//   ...props
// }: ModalProps) => {
//   return (
//     <ModalWrapper onClick={handleClose} {...props}>
//       <Modal
//         onClick={(e) => {
//           e.stopPropagation();
//           console.log("modal");
//         }}
//       >
//         <p>{tweet}</p>
//         {image && (
//           <img
//             onClick={() => window.open(image, "_blank")}
//             src={image}
//             height="108"
//             width="108"
//             alt=""
//           />
//         )}
//         {id}
//         {userId}
//         <button>edit</button>
//       </Modal>
//     </ModalWrapper>
//   );
// };

// const ModalWrapper = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100%;
//   z-index: 100;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: #000;
// `;

// const Modal = styled.div`
//   width: 540px;
//   height: 240px;
//   background-color: #fff;
//   border-radius: 15px;
// `;
