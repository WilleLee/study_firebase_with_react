import styled from "styled-components";
import SignupForm from "./SignupForm";

export default function Signup() {
  return (
    <Wrapper>
      <h2>Join us in 10 seconds</h2>
      <SignupForm />
    </Wrapper>
  );
}

const Wrapper = styled.div``;
