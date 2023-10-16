import React from "react";

interface Props extends React.AllHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form = ({ children, ...props }: Props) => {
  return <form {...props}>{children}</form>;
};

export default Form;
