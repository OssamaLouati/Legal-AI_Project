import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Newsletter } from "./newsletter";

interface FormattedFormData {
  [key: string]: string;
  EMAIL: string;
}
export const MailchimpForm = () => {
  const postUrl = `${process.env.REACT_APP_MAILCHIMP_URL}?u=${process.env.REACT_APP_MAILCHIMP_U}&id=${process.env.REACT_APP_MAILCHIMP_ID}`;

  return (
    <>
      <MailchimpSubscribe
        url={postUrl}
        render={({ subscribe, status, message }) => {
          const formattedStatus = status || "";
          const formattedMessage = message instanceof Error ? "Error occurred" : message || "";

          return (
            <Newsletter
              status={formattedStatus}
              message={formattedMessage}
              onValidated={(formData: FormattedFormData) => subscribe(formData)}
            />
          );
        }}
      />
    </>
  );
};
