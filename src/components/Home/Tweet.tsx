import styled from "styled-components";

type Props = {
  username: string;
  image: string | null;
  tweet: string;
};

const Tweet = ({ username, image, tweet }: Props) => {
  return (
    <Wrapper>
      <p>{username}</p>
      <p>{tweet}</p>
      {image && <img src={image} alt="" />}
    </Wrapper>
  );
};

export default Tweet;

const Wrapper = styled.div`
  width: 100%;
`;
