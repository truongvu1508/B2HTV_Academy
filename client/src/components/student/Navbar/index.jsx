import React, { useContext } from "react";
import { assets } from "../../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import Home from "../../../pages/student/Home";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "./Navbar.scss";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const location = useLocation();

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

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <header className="bg-dark-1 pb-3 pt-3">
      <nav className="flex justify-between items-center w-[82%] mx-auto ">
        <div>
          <img
            onClick={() => navigate("/")}
            className="w-16 cursor-pointer"
            src={assets.img_placeholder}
            alt="B2HTV Academy"
          />
        </div>
        <div className="">
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
              <NavLink className={navLinkStyles} to={"/blog"}>
                Blog
              </NavLink>
            </li>

            <li>
              <NavLink className={navLinkStyles} to={"/contact"}>
                Liên hệ
              </NavLink>
            </li>
            {user && (
              <li className="my-enrollments bg-green-1">
                {/* <button
                  onClick={() => {
                    navigate("/educator");
                  }}
                >
                  
                </button>{" "}
                | */}
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-dark-1 font-bold"
                      : "hover:text-dark-1 font-bold text-blue-1"
                  }
                  to={"/my-enrollments"}
                >
                  {isEducator ? "Educator Dashboard" : "Khóa học của tôi"}
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div>
          <button className="hover:text-blue-1 text-white mr-5">
            <ShoppingCartOutlined className="card" />
          </button>
          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="hover:text-blue-1 text-white"
            >
              <UserOutlined className="user" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
