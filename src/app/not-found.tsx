
"use client";

import React from 'react';
import { Result, Button } from 'antd';
import { useRouter } from "next/navigation";


const NotFound: React.FC = () => {
  const router = useRouter();


  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are looking for does not exist."
      extra={
        <Button type="primary" onClick={() => router.push('/dashboard')}
>
          Back to Dashboard
        </Button>
      }
    />
  );
};

export default NotFound;
