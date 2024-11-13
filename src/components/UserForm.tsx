import React, { useEffect, useRef } from "react";
import { Form, Input, Upload, Button, Switch } from "antd";
import { LockOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface UserFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function UserForm({
  onSubmit,
  onCancel,
  initialValues,
}: UserFormProps) {
  const [form] = Form.useForm();
  const statusRef = useRef<HTMLSpanElement>(null);

  // Set the form's fields to initialValues when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth
          ? new Date(initialValues.dateOfBirth).toISOString().split("T")[0]
          : undefined,
        profilePictureId: initialValues?.profilePictureId || "",
        status: initialValues?.status == "ACTIVE",
      });
    } else {
      form.resetFields(); // Reset the form when initialValues is null (add new company)
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.dateOfBirth = values.dateOfBirth
        ? new Date(values.dateOfBirth).toISOString()
        : undefined;
      if (values.profilePictureId?.file) {
        values.profilePictureId =
          values.profilePictureId.file.response?.url || ""; // Adjust based on your file upload API response
      }
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onChange = (checked: boolean) => {
    if (statusRef.current) {
      statusRef.current.textContent = checked ? "Active" : "Inactive";
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Information */}
        <div className="md:col-span-2 text-center">
          <h1 className="font-medium text-base">
            {" "}
            {initialValues ? "Edit User" : "Add New User"}
          </h1>
          <h3 className="font-medium mb-4">User Information</h3>
        </div>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please enter firstName name" }]}
        >
          <Input placeholder="Enter firstName name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please enter lastName name" }]}
        >
          <Input placeholder="Enter lastName name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            { required: true, message: "Please input your Confirm Password!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item
          name="contacts"
          label="Contact Number"
          rules={[{ required: true, message: "Please enter contact number" }]}
        >
          <Input placeholder="Enter contact number" />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[
            { required: true, message: "Please enter date of birth" },
            {
              validator: (_, value) =>
                value && new Date(value) > new Date()
                  ? Promise.reject(
                      new Error("Date of birth cannot be in the future")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          name="createdBy"
          label="Created By"
          //   rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          name="companyId"
          label="Company Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter Company Id" />
        </Form.Item>
        {/* <Form.Item
          name="status"
          label={
            <div>
              Status: <span ref={statusRef}>Active</span>
            </div>
          }
          rules={[{ required: true, message: "Please enter company status" }]}
        >
          <Switch defaultChecked onChange={onChange} />
        </Form.Item> */}

        {/* Document Upload */}
        <div className="md:col-span-2">
          <h3 className="font-medium mb-4 mt-4">Documents</h3>
        </div>

        {/* <Form.Item
          name="companyLogo"
          label="Logo"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          //   rules={[{ required: true, message: "Please upload company logo" }]}
        >
          <Upload
            name="logo"
            listType="picture"
            // action="/api/upload" // Adjust to your file upload API
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Company Logo</Button>
          </Upload>
        </Form.Item> */}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          {initialValues ? "Update User" : "Add User"}
        </Button>
      </div>
    </Form>
  );
}
