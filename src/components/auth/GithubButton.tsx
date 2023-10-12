import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

const GithubButton = () => {
  const navigate = useNavigate();
  const handleClickButton = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.log(err.code);
      }
    }
  };
  return (
    <button onClick={handleClickButton}>
      <img src="/github-logo.svg" height="24" alt="" />
      Continue with Github
    </button>
  );
};

export default GithubButton;
