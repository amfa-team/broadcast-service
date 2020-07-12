import React, { useState } from "react";

export default function Ask(props: {
  text: string;
  children: JSX.Element;
}): JSX.Element {
  const [enabled, setEnabled] = useState(false);

  if (!enabled) {
    return (
      <div>
        <button onClick={(): void => setEnabled(true)}>{props.text}</button>
      </div>
    );
  }

  return props.children;
}
