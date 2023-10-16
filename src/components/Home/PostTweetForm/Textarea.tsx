import React, { forwardRef } from "react";

interface Props extends React.AllHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  return <textarea ref={ref} {...props} />;
});

export default Textarea;
