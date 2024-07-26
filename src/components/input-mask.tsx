import React from "react";
import MaskedInput from "react-text-mask";
import { Input } from "./ui/input";
import { on } from "events";

interface MaskedDateInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MaskedDateInput: React.FC<MaskedDateInputProps> = ({
  onChange,
  value,
}) => {
  return (
    <MaskedInput
      mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
      placeholder="DD/MM/YYYY"
      onChange={onChange}
      value={value ?? ""}
      render={(ref, props) => (
        <Input
          ref={(input) => {
            if (input) ref(input);
          }}
          {...props}
          type="text"
        />
      )}
    />
  );
};

export default MaskedDateInput;
