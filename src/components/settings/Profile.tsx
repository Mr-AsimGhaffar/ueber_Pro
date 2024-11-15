"use client";

import React, { useState } from "react";
import { Form, Input, Upload, Button, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useUser } from "@/hooks/context/AuthContext";
// import { useAuth } from "@/hooks/context/AuthContext";

// interface Props {
//   user: User;
// }

// interface User {
//   key: string;
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   contacts: string;
// }

// const fileList: UploadFile[] = [
//   {
//     uid: "-1",
//     name: "profile.png",
//     status: "done",
//     url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
//   },
// ];

export default function Profile() {
  const [form] = Form.useForm();
  const { user, setUser } = useUser();

  // API call to update user information

  // const handleEdit = async (userId: string) => {
  //   try {
  //     const response = await fetch(`/api/getUserById?id=${userId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSelectedUser(data.data);
  //       setUser(data.data);
  //       form.setFieldsValue(data.data); // Populate form with user data
  //     } else {
  //       const error = await response.json();
  //       message.error(error.message || "Failed to fetch user details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     message.error("An error occurred while fetching user details");
  //   }
  // };

  const onFinish = async (values: any) => {
    try {
      const response = await fetch("/api/updateUsers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id, // Use the user's ID
          ...values, // Include form values
        }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        form.setFieldsValue(result.data); // Update form fields with the response data
        setUser(result.data); // Update the user context if available
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("An error occurred while updating the user");
    }
  };

  // Simulating editing a user (replace '123' with the actual user ID)
  // useEffect(() => {
  //   const userId = Cookies.get("id"); // Use js-cookie to get the 'id' cookie
  //   if (userId) {
  //     handleEdit(userId);
  //   } else {
  //     message.error("User ID not found in cookies");
  //   }
  // }, []);
  // console.log("user", user);
  return (
    <div className="max-w-3xl">
      <Card title="Basic Information" className="mb-6">
        <p className="text-gray-500 mb-4">Information about user</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={user || {}}
        >
          {/* <div className="mb-6">
            <p className="mb-2">Profile picture</p>
            <p className="text-gray-500 text-sm mb-4">PNG, JPEG under 15 MB</p>
            <Upload fileList={fileList} listType="picture-card" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="firstName"
              required
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              required
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input placeholder="Enter Last Name" />
            </Form.Item>

            {/* <Form.Item
              label="Username"
              name="username"
              required
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Enter Username" />
            </Form.Item> */}

            <Form.Item label="Email" name="email" required>
              <Input placeholder="Enter Email" disabled />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="contacts"
              required
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-4">
            <Button>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>

      {/* <Card title="Address Information" className="mb-6">
        <p className="text-gray-500 mb-4">Information about address of user</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            address: "123 Main St",
            country: "United States",
            state: "California",
            city: "San Francisco",
            pincode: "94105",
          }}
        >
          <Form.Item
            label="Address"
            name="address"
            required
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter Address" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Country"
              name="country"
              required
              rules={[
                { required: true, message: "Please input your country!" },
              ]}
            >
              <Input placeholder="Enter Country" />
            </Form.Item>

            <Form.Item
              label="State"
              name="state"
              required
              rules={[{ required: true, message: "Please input your state!" }]}
            >
              <Input placeholder="Enter State" />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              required
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <Input placeholder="Enter City" />
            </Form.Item>

            <Form.Item
              label="Pincode"
              name="pincode"
              required
              rules={[
                { required: true, message: "Please input your pincode!" },
              ]}
            >
              <Input placeholder="Enter Pincode" />
            </Form.Item>
          </div>
        </Form>
      </Card> */}
    </div>
  );
}
