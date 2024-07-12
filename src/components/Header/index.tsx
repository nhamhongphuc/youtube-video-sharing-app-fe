import React from "react";
import { Button, Divider, Grid, Space, theme, Typography } from "antd";
import { VideoCameraAddOutlined, LogoutOutlined } from "@ant-design/icons";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `0px ${token.paddingLG}px`
        : `0px ${token.padding}px`,
    },
    divider: {
      margin: 0,
    },
    header: {
      backgroundColor: token.colorBgContainer,
      padding: `${token.paddingSM}px 0px`,
    },
    placeholder: {
      backgroundColor: token.colorBgLayout,
      border: `${token.lineWidth}px dashed ${token.colorBorder}`,
      borderRadius: token.borderRadiusLG,
      padding: token.paddingLG,
      textAlign: "center" as const,
    },
    section: {
      backgroundColor: token.colorBgContainer,
      padding: `${token.sizeXXL}px 0px`,
    },
    tagline: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      margin: "0px",
    },
    titleWrapper: {
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
  };
  return (
    <>
      <div style={styles.header}>
        <div style={styles.container}>
          <Space
            size="middle"
            direction={screens.md ? "horizontal" : "vertical"}
            style={styles.titleWrapper}
          >
            <Space direction="horizontal">
              <svg
                width="70px"
                height="70px"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <path
                  fill="red"
                  d="M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z"
                />
                <path
                  fill="#ffffff"
                  d="M6.593 10.11l3.644-2.098-3.644-2.11v4.208z"
                />
              </svg>
              <Title style={styles.title}>Youtube Sharing</Title>
            </Space>
            <Space>
              <Button type="primary" icon={<VideoCameraAddOutlined />}>Share Video</Button>
              <Button onClick={handleLogout} icon={<LogoutOutlined />}>Log out</Button>
            </Space>
          </Space>
        </div>
      </div>
      <Divider style={styles.divider} />
    </>
  );
};

export default AppHeader;
