// src/Home.tsx
import { useCallback, useEffect, useState } from "react";
import AppHeader from "../components/Header";
import api from "../services/api";
import { List, Skeleton, Image, Grid, Typography, message, theme } from "antd";
import { timeAgo } from "../ultils/ultils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
const { Paragraph } = Typography;
const socket = io("http://localhost:3005");

const { useToken } = theme;
const { useBreakpoint } = Grid;
export type Video = {
  id: string;
  URL: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  username: string;
};

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useToken();
  const screens = useBreakpoint();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/videos");
      setVideos(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    socket.on("videoShared", (value) => {
      const { userName, videoTitle } = value;
      if (
        !userName ||
        !videoTitle ||
        userName === localStorage.getItem("username")
      )
        return;

      const messageText: string = `${userName} shared a new video: ${videoTitle}`;

      message.info(messageText);
    });

    return () => {
      socket.off("videoShared");
    };
  }, []);

  const styles = {
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      padding: screens.md ? `${token.sizeXXS}px 0px` : "0px",
    },
    list: {
      margin: "0 auto",
      width: "90%",
      padding: screens.sm
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
    },
  };
  return (
    <>
      <AppHeader fetchData={fetchData} />
      <div>
        {loading ? (
          <Skeleton active />
        ) : (
          <List
            itemLayout="vertical"
            size="small"
            style={styles.list}
            dataSource={videos}
            renderItem={(item: Video) => (
              <List.Item
                key={item.title}
                style={{
                  flexDirection: "row-reverse",
                  gap: "16px",
                }}
                extra={
                  item.thumbnail && (
                    <Image
                      style={{
                        maxWidth: "500px",
                        minWidth: "240px",
                        maxHeight: "280px",
                        minHeight: "140px",
                      }}
                      alt="thumbnail"
                      src={item.thumbnail}
                    />
                  )
                }
              >
                <List.Item.Meta
                  title={<a href={item.URL}>{item.title}</a>}
                  description={
                    "Shared by: " +
                    item.username +
                    " • " +
                    timeAgo(item.createdAt)
                  }
                />
                <Paragraph ellipsis={{ rows: 8 }}>{item.description}</Paragraph>
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};

export default Home;
