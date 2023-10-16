import React from "react";

interface FileProps {
  children: React.ReactNode;
}
interface LabelProps extends React.AllHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}
interface InputProps extends React.AllHTMLAttributes<HTMLInputElement> {}

const File = ({ children }: FileProps) => {
  return <>{children}</>;
};

const Label = ({ children, ...props }: LabelProps) => {
  return <label {...props}>{children}</label>;
};

const Input = ({ ...props }: InputProps) => {
  return <input type="file" style={{ display: "none" }} {...props} />;
};

File.Label = Label;
File.Input = Input;

export default File;
