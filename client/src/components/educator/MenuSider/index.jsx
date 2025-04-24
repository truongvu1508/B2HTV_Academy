import React from "react";
import { Menu } from "antd";
import { BiSolidBookAdd } from "react-icons/bi";
import { LuBookMarked } from "react-icons/lu";
import { FaUserCheck } from "react-icons/fa";
import { DashboardOutlined } from "@ant-design/icons";
import { Link, useLocation, Navigate } from "react-router-dom";

function MenuSider() {
  const location = useLocation();

  if (location.pathname === "/educator") {
    return <Navigate to="/educator/dashboard" replace />;
  }
  const items = [
    {
      label: <Link to="/educator/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "/educator/dashboard",
    },
    // {
    //   label: <Link to="/educator/add-course">Add Course</Link>,
    //   icon: <BiSolidBookAdd />,
    //   key: "/educator/add-course",
    // },
    {
      label: <Link to="/educator/my-course">My Courses</Link>,
      icon: <LuBookMarked />,
      key: "/educator/my-course",
    },
    {
      label: <Link to="/educator/student-enrolled">Students Enrolled</Link>,
      icon: <FaUserCheck />,
      key: "/educator/student-enrolled",
    },
  ];

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[location.pathname]}
      style={{ fontSize: "10px", textTransform: "none" }}
    />
  );
}

export default MenuSider;
