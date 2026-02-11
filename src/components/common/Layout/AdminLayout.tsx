"use client";

import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { usePathname } from "next/navigation";

const { Content } = Layout;

const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 48;
const SIDEBAR_WIDTH = 240;
const COLLAPSED_WIDTH = 40;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          background: "linear-gradient(90deg, #eff6ff 0%, #e0e7ff 100%)",
          zIndex: 101,
          borderBottom: "1px solid #c7d2fe",
        }}
      >
        <Header />
      </div>

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Content */}
      <Layout
        style={{
         marginLeft: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH - 20,

          marginTop: HEADER_HEIGHT,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Content
          style={{
            background: "#f5f7fa",
            height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
            boxSizing: "border-box",
            overflowY: isDashboardPage ? "hidden" : "auto",
            padding: "24px",
            paddingBottom: isDashboardPage ? "24px" : `${FOOTER_HEIGHT + 24}px`,
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default AdminLayout;
