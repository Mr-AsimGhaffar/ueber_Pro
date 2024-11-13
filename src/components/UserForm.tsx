import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Upload, Button, Switch, Select } from "antd";
import { LockOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface UserFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

interface Company {
  id: number;
  name: string;
}

export default function UserForm({
  onSubmit,
  onCancel,
  initialValues,
}: UserFormProps) {
  const [form] = Form.useForm();
  const [userName, setUserName] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/listCompanies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.data); // Assuming API response has `data` with company list
        } else {
          console.error("Failed to fetch companies");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Set the form's fields to initialValues when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth
          ? new Date(initialValues.dateOfBirth).toISOString().split("T")[0]
          : undefined,
        profilePictureId: initialValues?.profilePictureId || "",
        contacts: initialValues.contacts ? String(initialValues.contacts) : "",
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
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      preserve={true}
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
          rules={[
            { required: true, message: "Please enter firstName name" },
            {
              min: 2,
              message: "First name must be at least 2 characters long",
            },
            {
              max: 50,
              message: "First name must be at most 50 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "First name must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter firstName name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: "Please enter lastName name" },
            { min: 2, message: "Last name must be at least 2 characters long" },
            {
              max: 50,
              message: "Last name must be at most 50 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "Last name must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter lastName name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        {!initialValues && (
          <>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your Password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long",
                },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain at least one letter and one number",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please input your Confirm Password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords don't match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="contacts"
          label="Contact Number"
          rules={[
            { required: true, message: "Please enter contact number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit contact number",
            },
          ]}
        >
          <Input placeholder="Enter contact number" />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[
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
          name="companyId"
          label="Company Name"
          rules={[{ required: true, message: "Please select a company" }]}
        >
          <Select
            placeholder="Select a company"
            loading={loading}
            options={userName.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select Status">
            <Select.Option value="ACTIVE">Active</Select.Option>
            <Select.Option value="IN_ACTIVE">Inactive</Select.Option>
            <Select.Option value="SUSPENDED">Suspended</Select.Option>
          </Select>
        </Form.Item>

        {/* Document Upload */}
        <div className="md:col-span-2">
          <h3 className="font-medium mb-4 mt-4">Documents</h3>
        </div>

        {/* Uncomment and extend validation for company logo upload */}
        {/* <Form.Item
      name="companyLogo"
      label="Logo"
      valuePropName="fileList"
      getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
      rules={[{ required: true, message: "Please upload company logo" }]}
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
