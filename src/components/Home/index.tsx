import styled from "styled-components";
import PostTweetForm from "./PostTweetForm";
import Timeline from "./Timeline";

const Home = () => {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
`;
