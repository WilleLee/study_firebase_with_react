import { db } from "../../firebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tweet from "./Tweet";
import { Unsubscribe } from "firebase/auth";

let unsubscribe: Unsubscribe | null = null;

export interface Tweet {
  id: string;
  createdAt: number;
  tweet: string;
  userId: string;
  username: string;
  image: string | null;
}

const Timeline = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  const getTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      limit(15)
    );
    unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
      const tmpTweets = snapshot.docs.map((doc) => {
        const { createdAt, tweet, userId, username, image } = doc.data();
        return {
          id: doc.id,
          createdAt,
          tweet,
          userId,
          username,
          image,
        };
      });
      setTweets(tmpTweets);
    });
  };

  useEffect(() => {
    getTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
};

export default Timeline;

const Wrapper = styled.div`
  width: 100%;
`;
