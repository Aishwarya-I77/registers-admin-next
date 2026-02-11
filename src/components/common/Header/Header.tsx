"use client";
import React from 'react';
import { Avatar, Dropdown } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';


const Header: React.FC = () => {
  const router = useRouter();

   const { logout, user } = useAuth();

  return (
    <div style={styles.header}>
      {/* Logo */}
      <div
        style={styles.logoContainer}
        onClick={() => window.open('https://www.acquanthr.com/', '_blank')}
      >
        <img
          src="/assets/images/aquanthr-logo.png"
          alt="AcquantHR"
          style={styles.logo}
        />
      </div>

      {/* Profile Section */}
      <Dropdown
  trigger={['click']}
  popupRender={() => (
          <div style={styles.dropdownCard}>
            <div
              style={{ ...styles.menuItem, color: '#1d4ed8' }}
              onClick={() => {
                logout();
               router.push('/login');
router.replace('/dashboard');

              }}
            >
              <LogoutOutlined style={styles.logoutIcon} />
              <span>Logout</span>
            </div>
          </div>
        )}
      >
        <div style={styles.profileWrapper}>
          {/* Name & Email FIRST */}
          <div style={styles.profileInfo}>
            <div style={styles.profileName}>
              {user?.name || 'Admin User'}
            </div>
            <div style={styles.profileEmail}>
              {user?.email || 'admin@company.com'}
            </div>
          </div>

          {/* Avatar LAST */}
          <Avatar style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
        </div>
      </Dropdown>
    </div>
  );
};

export default Header;

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    height: '64px',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient( #ffffff )',
    borderBottom: '1px solid #ffffff',
  },

  logoContainer: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },

  logo: {
    height: '40px',
    width: 'auto',
    objectFit: 'contain',
  },

  profileWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },

  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    lineHeight: 1.2,
  },

  profileName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e3a8a',
  },

  profileEmail: {
    fontSize: '12px',
    color: '#475569',
  },

  avatar: {
    backgroundColor: '#2563eb',
    fontWeight: 600,
    color: '#ffffff',
  },

  dropdownCard: {
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
  padding: '6px 0',      // 👈 reduced vertical padding
  minWidth: '160px',    // 👈 reduced width
},

  menuItem: {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '5px 50px',   // 👈 reduced
  fontSize: '14px',      // 👈 slightly smaller (optional but cleaner)
  cursor: 'pointer',
  background: 'transparent',
},

  logoutIcon: {
    fontSize: '18px',
    color: '#2563eb',
  },
};
