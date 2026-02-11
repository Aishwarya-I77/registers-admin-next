// src/pages/Login/Login.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";

import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();


  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const fullText = 'Welcome Back';
const [typedText, setTypedText] = useState('');


useEffect(() => {
  let index = 0;

  const interval = setInterval(() => {
    setTypedText(fullText.slice(0, index + 1));
    index++;

    if (index === fullText.length) {
      clearInterval(interval);
    }
  }, 80); 

  return () => clearInterval(interval);
}, []);


  const handleLogin = async () => {
    if (!username || !password) {
      message.error('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      router.replace('/dashboard'); 
    } catch {
      message.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* LEFT */}
        <div style={styles.left}>
          <img
            src="/assets/images/login.png"
            alt="Login"
            style={styles.illustration}
          />
          <p style={styles.leftText}>
            Secure access to AcquantHR analytics & workforce insights.
          </p>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <img
            src="/assets/images/aquanthr-logo.png"
            alt="AcquantHR"
            style={styles.logo}
          />

          <div style={styles.badge}>
            {typedText}
            <span style={styles.cursor}>|</span>
          </div>

          <h2 style={styles.title}>Login to your account</h2>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <Input
  variant="borderless"
  prefix={<UserOutlined />}
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  style={styles.input}
/>

            <div style={styles.underline} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
           <Input.Password
  variant="borderless"
  prefix={<LockOutlined />}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={styles.input}
/>

            <div style={styles.underline} />
          </div>

          <Button
            loading={loading}
            onClick={handleLogin}
            style={styles.loginButton}
          >
            Login
          </Button>

        
        </div>
      </div>
    </div>
  );
};

export default Login;

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
 page: {
  height: '100vh',        // ✅ fixed height instead of minHeight
  background: '#F4F7FB',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',     // ✅ removes scrollbar
  padding: 0,             // ✅ remove padding that causes overflow
},


  card: {
    width: '100%',
    maxWidth: 1000,
    height: 560,
    background: '#ffffff',
    borderRadius: 20,
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(52,109,234,0.15)',
  },

  /* LEFT */
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #346DEA, #2454C6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    color: '#ffffff',
  },

  illustration: {
    width: '80%',
    maxWidth: 300,
    marginBottom: 24,
  },

  leftText: {
    fontSize: 13,
    opacity: 0.9,
    textAlign: 'center',
  },

  /* RIGHT */
  right: {
    flex: 1,
    padding: '48px 56px',
    display: 'flex',
    flexDirection: 'column',
  },

  logo: {
    width: 180,
    marginBottom: 16,
  },

  badge: {
    background: '#E8F0FF',
    color: '#346DEA',
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    width: 'fit-content',
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1F2937',
    marginBottom: 32,
  },

  inputGroup: {
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    color: '#6B7280',
  },

  input: {
    padding: '8px 0',
    fontSize: 16,
  },

  underline: {
    height: 1,
    background: '#DCE6FF',
    marginTop: 4,
  },

  loginButton: {
    marginTop: 24,
    height: 44,
    borderRadius: 22,
    border: 'none',
    background: '#346DEA',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 16,
  },

  links: {
    marginTop: 24,
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#6B7280',
    cursor: 'pointer',
  },
  cursor: {
  marginLeft: 2,
  animation: 'blink 2s ',
},

};
