"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Form, Input, Button, Checkbox, Card, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || `/${lang}/index/home`;
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, refreshToken, user } = data.data;

        Cookies.set("accessToken", token.token, { expires: 1 });
        Cookies.set("refreshToken", refreshToken.token, { expires: 7 });
        Cookies.set("id", user.id, { expires: 1 });

        message.success("Successfully logged in!");
        router.push(redirectUrl);
      } else {
        const data = await response.json();
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      message.error("An error occurred during login");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleForgotPasswordClick = async () => {
    setLoadingForgotPassword(true);
    // Simulate a delay or API request for "forgot password" logic
    setTimeout(() => {
      setLoadingForgotPassword(false); // Stop loading after the request
      router.push(`/${lang}/auth/forgot-password`);
    }, 2000); // Simulate a delay of 2 seconds for the request
  };

  return (
    <Card className="w-full max-w-md">
      <Spin size="large" spinning={loading}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Please sign in to your account</p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="custom-checkbox">Remember me</Checkbox>
              </Form.Item>
              <Button
                type="link"
                className="text-teal-800 hover:!text-teal-700 text-sm"
                onClick={handleForgotPasswordClick}
                loading={loadingForgotPassword}
              >
                Forgot password?
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-teal-800 hover:!bg-teal-700"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}
