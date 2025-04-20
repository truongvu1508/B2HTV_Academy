import React from "react";
import { Layout } from "antd";
import "./LayoutDefault.css";
import {
  SearchOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";

import { Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import MenuSider from "../../components/educator/MenuSider";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
const { Sider, Content } = Layout;

function LayoutDefault() {
  const [collapsed, setCollapsed] = useState(false);
  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const { openSignIn } = useClerk();
  const { user } = useUser();
  return (
    <>
      <Layout className="layout-default">
        <header className="header">
          <div
            className={
              "header__logo " + (collapsed && "header__logo--collapsed")
            }
          >
            <img src={collapsed ? assets.logo_fold : assets.logo} alt="logo" />
          </div>
          <div className="header__nav">
            <div className="header__nav-left">
              <div className="header__collapse">
                <MenuUnfoldOutlined onClick={handleCollapsed} />
              </div>
            </div>
            <div className="header__nav-right">
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
          </div>
        </header>
        <Layout>
          <Sider className="sider" collapsed={collapsed} theme="light">
            <MenuSider />
          </Sider>
          <Content className="content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
export default LayoutDefault;
