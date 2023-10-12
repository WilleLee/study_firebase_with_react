import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import GithubButton from "../auth/GithubButton";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignupForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { name: "", email: "", password: "" },
  });
  const onSubmit: SubmitHandler<FormData> = async (FormData) => {
    console.log(FormData);
    setError("");
    if (isLoading) return;
    if (!FormData.email || !FormData.password || !FormData.name) return;
    try {
      setIsLoading(true);
      // fetch
      const credentials = await createUserWithEmailAndPassword(
        auth,
        FormData.email,
        FormData.password
      );
      console.log(credentials);
      await updateProfile(credentials.user, {
        displayName: FormData.name,
      });
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
        <Input type="text" placeholder="name" {...register("name")} />
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
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
};

export default SignupForm;

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
