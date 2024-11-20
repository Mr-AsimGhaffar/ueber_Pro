"use client";

import React from "react";
import Link from "next/link";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      if (response.ok) {
        message.success(
          "If an account exists with this email, you will receive password reset instructions."
        );
        // Redirect back to login after 2 seconds
        setTimeout(() => {
          router.push(`/${lang}/auth/login`);
        }, 2000);
      } else {
        const errorData = await response.json();
        message.error(
          errorData.message ||
            "Failed to send reset instructions. Please try again."
        );
      }
    } catch (error) {
      message.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-gray-600">
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>
      </div>

      <Form
        name="forgot-password"
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
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Send Reset Instructions
          </Button>
        </Form.Item>

        <div className="text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              href={`/${lang}/auth/login`}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to login
            </Link>
          </p>
        </div>
      </Form>
    </Card>
  );
}
