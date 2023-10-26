import React, { useEffect, useMemo, useState } from "react";
import { auth } from "../../firebase";
import { updateProfile } from "firebase/auth";

type InputState = "editing" | "loading" | "idle";

const ProfileName = React.memo(() => {
  const [displayName, setDisplayName] = useState("Anonymous");
  const [inputState, setInputState] = useState<InputState>("idle");
  const user = auth.currentUser;
  const handleClickEdit = async (newName: string) => {
    if (!user) return;
    setInputState("loading");
    try {
      await updateProfile(user, {
        displayName: newName,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setInputState("idle");
    }
  };
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName ?? "Anonymous");
  }, [user]);

  const buttonText = useMemo(() => {
    switch (inputState) {
      case "editing":
        return "Save";
      case "loading":
        return "Loading...";
      default:
        return "Edit";
    }
  }, [inputState]);

  return (
    <div>
      <input
        disabled={inputState !== "editing"}
        value={displayName}
        onChange={handleChangeName}
      />
      <button
        disabled={inputState === "loading"}
        onClick={() => {
          if (inputState === "idle") {
            setInputState("editing");
            return;
          } else {
            if (!!user && user?.displayName !== displayName) {
              handleClickEdit(displayName);
            }
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  );
});

export default ProfileName;
