"use client";

import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

const SIDEBAR_WIDTH = 220;
const COLLAPSED_WIDTH = 50;
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 30;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredSupport, setHoveredSupport] = React.useState(false);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "/analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
  ];

  return (
    <Sider
      width={SIDEBAR_WIDTH}
      collapsedWidth={COLLAPSED_WIDTH}
      collapsed={collapsed}
      trigger={null}
      style={{
        position: "fixed",
        left: 0,
        top: HEADER_HEIGHT,
        bottom: FOOTER_HEIGHT,
        background: "linear-gradient( rgb(255, 255, 255))",
        borderRight: "1px solid rgba(21, 19, 19, 0.12)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      {/* ================= TOGGLE BUTTON ================= */}
      <div
        style={{
          padding: "12px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          flexShrink: 0,
        }}
      >
        <div
          onClick={() => onCollapse(!collapsed)}
          style={{
            cursor: "pointer",
            fontSize: "18px",
            color: "rgb(40, 85, 198)",
            padding: "8px",
            borderRadius: "6px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgb(40, 85, 198)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgb(40, 85, 198)";
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>

      {/* ================= MENU ================= */}
      <Menu
  mode="inline"
  theme="light"
  inlineCollapsed={collapsed}
  selectedKeys={[pathname]}
  onClick={({ key }) => router.push(key)}
  style={{
    borderRight: "none",
    padding: collapsed ? "8px 4px" : "8px",
    flex: 1,
    overflowY: "auto",
    background: "transparent",
  }}
  items={menuItems}
/>


      {/* ================= SUPPORT CENTER ================= */}
      
{!collapsed && (
  <div
    style={{
      marginTop: "260px",   // 👈 THIS pushes it to bottom
      padding: "16px 20px",
      color: "rgb(40, 85, 198)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      transition: "color 0.2s ease",
      flexShrink: 0,
      background: "transparent",
      // borderTop: "1px solid rgba(0,0,0,0.08)", // optional divider line
    }}
    onClick={() => router.push("/support-center")}
  >
    <QuestionCircleOutlined />
    <span>Support Center</span>
  </div>
)}

    </Sider>
  );
};

export default Sidebar;
