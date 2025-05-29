import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./Navbar.scss";
import { UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../../context/AppContext";
import { useSignInCustom } from "../../../hooks/useSignInCustom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const handleSignIn = useSignInCustom();
  const { user } = useUser();
  const { navigate, isEducator, userData } = useContext(AppContext);
  const location = useLocation();
  const [isLockNotified, setIsLockNotified] = useState(false); // Trạng thái để tránh lặp thông báo

  // Kiểm tra isLocked từ userData
  useEffect(() => {
    if (userData && userData.isLocked && !isLockNotified) {
      toast.error(
        "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin qua số điện thoại 0987654321 để được hỗ trợ.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setIsLockNotified(true); // Đánh dấu đã hiển thị thông báo
    }
  }, [userData, isLockNotified]);

  const navLinkStyles = ({ isActive }) =>
    isActive
      ? "text-green-1 font-bold"
      : "text-white font-bold hover:text-green-1";

  const isCourseActive = () => {
    return (
      location.pathname === "/course-list" ||
      location.pathname.startsWith("/course-list/") ||
      location.pathname.startsWith("/course/")
    );
  };

  return (
    <header className="bg-dark-1 pb-3 pt-3 border-b border-gray-600">
      <nav className="flex justify-between items-center w-[82%] mx-auto">
        <div>
          <img
            onClick={() => navigate("/")}
            className="w-[200px] cursor-pointer"
            src={assets.logo_b2htv}
            alt="B2HTV Academy"
          />
        </div>
        <div>
          <ul className="flex items-center gap-[4vw]">
            <li>
              <NavLink className={navLinkStyles} to={"/"}>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  navLinkStyles({ isActive: isActive || isCourseActive() })
                }
                to={"/course-list"}
              >
                Khóa học
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkStyles} to={"/about"}>
                Về chúng tôi
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkStyles} to={"/contact"}>
                Liên hệ
              </NavLink>
            </li>
            {user && (
              <li className="my-enrollments bg-green-1">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-dark-1 font-bold"
                      : "hover:text-dark-1 font-bold text-blue-1"
                  }
                  to={isEducator ? "/educator" : "/my-enrollments"}
                >
                  {isEducator ? "Educator Dashboard" : "Khóa học của tôi"}
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div>
          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={handleSignIn}
              className="hover:text-blue-1 text-white"
            >
              <UserOutlined className="user" />
            </button>
          )}
        </div>
      </nav>
      <ToastContainer />
    </header>
  );
};

export default Navbar;
