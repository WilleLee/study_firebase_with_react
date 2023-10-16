import styled from "styled-components";
import LoginForm from "@components/Login/LoginForm";

// type Props = {};

const Login = () => {
  return (
    <Wrapper>
      <h2>Log in</h2>
      <LoginForm />
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div``;
