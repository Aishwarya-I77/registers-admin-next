"use client";
import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="admin-footer">
      <span>(c) {new Date().getFullYear()} AcquantHR. All rights reserved.</span>
    </div>
  );
};

export default Footer;


