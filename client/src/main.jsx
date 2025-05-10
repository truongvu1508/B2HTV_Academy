import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      localization={{
        socialButtonsBlockButton: "Tiếp tục với {{provider}}",
        dividerText: "hoặc",
        formFieldLabel__emailAddress: "Địa chỉ email",
        formFieldInputPlaceholder__emailAddress: "Nhập địa chỉ email của bạn",
        formFieldLabel__password: "Mật khẩu",
        formFieldInputPlaceholder__password: "Nhập mật khẩu của bạn",
        formButtonPrimary: "Tiếp tục",
        signIn: {
          start: {
            title: "Đăng nhập vào B2HTV Academy",
            subtitle: "Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục",
            actionLink: "Đăng ký",
            actionText: "Bạn chưa có tài khoản?",
          },
        },
        signUp: {
          start: {
            title: "Tạo tài khoản mới",
            subtitle: "Chào mừng! Vui lòng điền thông tin để bắt đầu.",
          },
        },
      }}
      appearance={{
        localizationOverrides: {
          "Don't have an account?": "Chưa có tài khoản?",
          "Sign up": "Đăng ký",
          "Secured by": "Bảo mật bởi",
          "Development mode": "Chế độ phát triển",
          "Sign in to B2HTV Academy": "Đăng nhập vào B2HTV Academy",
          "Welcome back! Please sign in to continue":
            "Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục",
        },
      }}
    >
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ClerkProvider>
  </BrowserRouter>
);
