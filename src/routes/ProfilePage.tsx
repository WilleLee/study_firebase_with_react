import React, { useCallback, useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import UserSvg from "../components/svgs/UserSvg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Tweet as ITweet } from "../components/Home/Timeline";
import Tweet from "../components/Home/Tweet";
import ProfileName from "../components/Profile/ProfileName";

const ProfilePage = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!confirm("Are you sure you want to change your avatar?")) {
      e.target.value = "";
      return;
    }
    const { files } = e.target;
    if (files && files.length === 1) {
      const locationRef = ref(storage, `avatars/${user.uid}`);
      const result = await uploadBytes(locationRef, files[0]);
      const url = await getDownloadURL(result.ref);
      setAvatar(url);
      await updateProfile(user, {
        photoURL: url,
      });
    }
  };

  const [tweets, setTweets] = useState<ITweet[]>([]);
  const getTweets = useCallback(async () => {
    if (!user) return;
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const snapshot = await getDocs(tweetQuery);
    const tmpTweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, username, userId, image } = doc.data();
      return {
        tweet,
        createdAt,
        username,
        userId,
        image,
        id: doc.id,
      };
    });
    console.log(tmpTweets);
    setTweets(tmpTweets);
  }, [user]);

  useEffect(() => {
    getTweets();
  }, [getTweets]);
  return (
    <div>
      <label htmlFor="profile-avatar">
        {avatar ? <img src={avatar} alt="avatar" /> : <UserSvg />}
      </label>
      <input
        id="profile-avatar"
        type="file"
        accept="image/*"
        onChange={handleChangeAvatar}
      />
      <ProfileName />
      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
