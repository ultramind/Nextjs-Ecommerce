import { userCountry } from "@atoms/userCountry";
import { ErrorMessage } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRecoilValue } from "recoil";

interface Props {
  value: string;
  defaultCountry?: string;
  onChange: (value: string) => void;
  [x: string]: any;
}

function PhoneNumberSelect({
  defaultCountry,
  value,
  onChange,
  inputProps: { name, ...props },
}: Props) {
  const Country = useRecoilValue(userCountry);
  return (
    <>
      <PhoneInput
        country={Country?.toLowerCase() || defaultCountry?.toLowerCase()}
        value={value}
        onChange={onChange}
        autoFormat={false}
        countryCodeEditable={false}
        enableSearch
        disableSearchIcon={true}
        autocompleteSearch
        inputProps={{ ...props, name }}
      />
      <ErrorMessage name={name}>
        {(msg: string) => <p className="mt-1 text-xs text-red-500">{msg}</p>}
      </ErrorMessage>
    </>
  );
}

export default PhoneNumberSelect;
