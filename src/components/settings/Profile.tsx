"use client";

import React from 'react';
import { Form, Input, Upload, Button, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const fileList: UploadFile[] = [
  {
    uid: '-1',
    name: 'profile.png',
    status: 'done',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  },
];

export default function Profile() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <div className="max-w-3xl">
      <Card title="Basic Information" className="mb-6">
        <p className="text-gray-500 mb-4">Information about user</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'john.doe@example.com',
            phone: '+1 234 567 890',
          }}
        >
          <div className="mb-6">
            <p className="mb-2">Profile picture</p>
            <p className="text-gray-500 text-sm mb-4">PNG, JPEG under 15 MB</p>
            <Upload fileList={fileList} listType="picture-card" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="firstName"
              required
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              required
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input placeholder="Enter Last Name" />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              required
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Enter Username" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              required
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input placeholder="Enter Email" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              required
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card title="Address Information" className="mb-6">
        <p className="text-gray-500 mb-4">Information about address of user</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            address: '123 Main St',
            country: 'United States',
            state: 'California',
            city: 'San Francisco',
            pincode: '94105',
          }}
        >
          <Form.Item
            label="Address"
            name="address"
            required
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter Address" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Country"
              name="country"
              required
              rules={[{ required: true, message: 'Please input your country!' }]}
            >
              <Input placeholder="Enter Country" />
            </Form.Item>

            <Form.Item
              label="State"
              name="state"
              required
              rules={[{ required: true, message: 'Please input your state!' }]}
            >
              <Input placeholder="Enter State" />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              required
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <Input placeholder="Enter City" />
            </Form.Item>

            <Form.Item
              label="Pincode"
              name="pincode"
              required
              rules={[{ required: true, message: 'Please input your pincode!' }]}
            >
              <Input placeholder="Enter Pincode" />
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
    </div>
  );
}