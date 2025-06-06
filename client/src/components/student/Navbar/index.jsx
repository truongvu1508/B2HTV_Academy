import React, { useContext, useState } from "react";
import { assets } from "../../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import "./Navbar.scss";
import { UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../../context/AppContext";
import { useSignInCustom } from "../../../hooks/useSignInCustom";

const Navbar = () => {
  const handleSignIn = useSignInCustom();
  const { user } = useUser();
  const { navigate, isEducator } = useContext(AppContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkStyles = ({ isActive }) =>
    isActive
      ? "text-green-1 font-bold"
      : "text-white font-bold hover:text-green-1";

  const mobileNavLinkStyles = ({ isActive }) =>
    isActive
      ? "text-green-1 font-bold block py-2 px-4 border-b border-gray-600"
      : "text-white font-bold hover:text-green-1 block py-2 px-4 border-b border-gray-600";

  const isCourseActive = () => {
    return (
      location.pathname === "/course-list" ||
      location.pathname.startsWith("/course-list/") ||
      location.pathname.startsWith("/course/")
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-dark-1 pb-3 pt-3 border-b border-gray-600">
      <nav className="flex justify-between items-center w-[82%] mx-auto relative">
        {/* Logo */}
        <div>
          <img
            onClick={() => navigate("/")}
            className="w-[200px] cursor-pointer"
            src={assets.logo_b2htv}
            alt="B2HTV Academy"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
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

        {/* Desktop User Button */}
        <div className="hidden lg:block">
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          {/* Mobile User Button */}
          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={handleSignIn}
              className="hover:text-blue-1 text-white"
            >
              <UserOutlined className="text-2xl" />
            </button>
          )}

          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="text-white hover:text-green-1 text-2xl"
          >
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-dark-1 border-t border-gray-600 z-50">
            <ul className="flex flex-col">
              <li>
                <NavLink
                  className={mobileNavLinkStyles}
                  to={"/"}
                  onClick={closeMenu}
                >
                  Trang chủ
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    mobileNavLinkStyles({
                      isActive: isActive || isCourseActive(),
                    })
                  }
                  to={"/course-list"}
                  onClick={closeMenu}
                >
                  Khóa học
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={mobileNavLinkStyles}
                  to={"/about"}
                  onClick={closeMenu}
                >
                  Về chúng tôi
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={mobileNavLinkStyles}
                  to={"/contact"}
                  onClick={closeMenu}
                >
                  Liên hệ
                </NavLink>
              </li>
              {user && (
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "text-green-1 font-bold block py-2 px-4 bg-green-1 text-dark-1"
                        : "hover:text-green-1 font-bold text-blue-1 block py-2 px-4 bg-green-1 hover:bg-opacity-80"
                    }
                    to={isEducator ? "/educator" : "/my-enrollments"}
                    onClick={closeMenu}
                  >
                    {isEducator ? "Educator Dashboard" : "Khóa học của tôi"}
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
