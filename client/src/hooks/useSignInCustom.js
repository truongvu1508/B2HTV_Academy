import { useClerk } from "@clerk/clerk-react";

export const useSignInCustom = (customConfig = {}) => {
  const { openSignIn } = useClerk();

  const defaultConfig = {
    appearance: {
      baseTheme: "default",
      elements: {
        formButtonPrimary: {
          backgroundColor: "#00175D",
          color: "#ffffff",
        },
        headerTitle: {
          color: "#00175D",
        },
        card: {
          backgroundColor: "#ffffff",
        },
        formFieldLabel: {
          color: "#333",
        },
      },
      variables: {
        colorPrimary: "#001e78",
        fontFamily: "Arial, sans-serif",
      },
    },
  };

  const handleSignIn = () => {
    openSignIn({
      ...defaultConfig,
      ...customConfig,
    });
  };

  return handleSignIn;
};
