import React from 'react';
import { Form, Input, DatePicker, Upload, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface DriverFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function DriverForm({ onSubmit, onCancel, initialValues }: DriverFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <div className="md:col-span-2">
          <h3 className="font-medium mb-4">Personal Information</h3>
        </div>

        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input.TextArea rows={1} placeholder="Enter address" />
        </Form.Item>

        {/* License Information */}
        <div className="md:col-span-2">
          <h3 className="font-medium mb-4 mt-4">License Information</h3>
        </div>

        <Form.Item
          name="licenseNumber"
          label="License Number"
          rules={[{ required: true, message: 'Please enter license number' }]}
        >
          <Input placeholder="Enter license number" />
        </Form.Item>

        <Form.Item
          name="expiryDate"
          label="License Expiry Date"
          rules={[{ required: true, message: 'Please select expiry date' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="licenseClass"
          label="License Class"
          rules={[{ required: true, message: 'Please enter license class' }]}
        >
          <Input placeholder="Enter license class" />
        </Form.Item>

        <Form.Item
          name="issuingAuthority"
          label="Issuing Authority"
          rules={[{ required: true, message: 'Please enter issuing authority' }]}
        >
          <Input placeholder="Enter issuing authority" />
        </Form.Item>

        {/* Document Upload */}
        <div className="md:col-span-2">
          <h3 className="font-medium mb-4 mt-4">Documents</h3>
        </div>

        <Form.Item
          name="licensePhoto"
          label="License Photo"
          rules={[{ required: true, message: 'Please upload license photo' }]}
        >
          <Upload maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Upload License Photo</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="identityProof"
          label="Identity Proof"
          rules={[{ required: true, message: 'Please upload identity proof' }]}
        >
          <Upload maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Upload Identity Proof</Button>
          </Upload>
        </Form.Item>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Form>
  );
}