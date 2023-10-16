import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import GithubButton from "../auth/GithubButton";

type FormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  });
  const onSubmit: SubmitHandler<FormData> = async (FormData) => {
    console.log(FormData);
    setError("");
    if (isLoading) return;
    if (!FormData.email || !FormData.password) return;
    try {
      setIsLoading(true);
      // fetch
      await signInWithEmailAndPassword(auth, FormData.email, FormData.password);
      navigate("/");
    } catch (err) {
      // error handling
      if (err instanceof FirebaseError) {
        setError(err.message);
        console.log(err.code);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input type="email" placeholder="email" {...register("email")} />
        <Input
          type="password"
          placeholder="password"
          required
          {...register("password")}
        />
        <Input
          type="submit"
          disabled={isLoading}
          value={isLoading ? "Loading..." : "Sign up"}
        />
      </Form>
      {error && <div>{error}</div>}
      <Switcher>
        Don't have an account?{" "}
        <Link to="/signup">Create an account &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
};

export default LoginForm;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const Input = styled.input``;

const Switcher = styled.span``;
