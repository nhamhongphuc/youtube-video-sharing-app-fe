import React from "react";
import { Avatar, Button, Layout, Menu } from "antd";
import { UserOutlined, YoutubeFilled } from "@ant-design/icons"; // Add this line
import useAuthStore from "../../store/authStore";
import Item from "antd/es/list/Item";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };
  return (
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Item>
          <YoutubeFilled style={{ fontSize: "16px", color: "#08c" }} />
        </Item>
        <Item key="1">
          <Avatar size="small" icon={<UserOutlined />} />
          {user || "Guest"}
        </Item>
        <Item key="logout-btn">
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;
