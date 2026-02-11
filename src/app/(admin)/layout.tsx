"use client";

import React from 'react';
import AdminLayoutComponent from '@/components/common/Layout/AdminLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </ProtectedRoute>
  );
}
