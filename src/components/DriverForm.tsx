import React, { useEffect, useRef } from "react";
import { Form, Input, Upload, Button, Switch } from "antd";
import { LockOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface DriverFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function DriverForm({
  onSubmit,
  onCancel,
  initialValues,
}: DriverFormProps) {
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
        licenseExpiryDate: initialValues.licenseExpiryDate
          ? new Date(initialValues.licenseExpiryDate)
              .toISOString()
              .split("T")[0]
          : undefined,
        profilePictureId: initialValues?.profilePictureId || "",
        status: initialValues?.status == "ACTIVE",
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Format dates for backend
      values.dateOfBirth = values.dateOfBirth
        ? new Date(values.dateOfBirth).toISOString()
        : undefined;
      values.licenseExpiryDate = values.licenseExpiryDate
        ? new Date(values.licenseExpiryDate).toISOString()
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
            {initialValues ? "Edit Driver" : "Add New Driver"}
          </h1>
          <h3 className="font-medium mb-4">Driver Information</h3>
        </div>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="Enter first Name name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Enter last Name name" />
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
        <Form.Item name="nic" label="Cnic Name" rules={[{ required: true }]}>
          <Input placeholder="Enter Cnic Id" />
        </Form.Item>
        <Form.Item
          name="status"
          label={
            <div>
              Status: <span ref={statusRef}>Active</span>
            </div>
          }
          rules={[{ required: true, message: "Please enter driver status" }]}
        >
          <Switch defaultChecked onChange={onChange} />
        </Form.Item>

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
        <Form.Item
          name="licenseExpiryDate"
          label="License Expiry Date"
          rules={[
            { required: true, message: "Please enter license expiry date" },
            {
              validator: (_, value) =>
                value && new Date(value) >= new Date()
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("License expiry date must be in the future")
                    ),
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          {initialValues ? "Update Driver" : "Add Driver"}
        </Button>
      </div>
    </Form>
  );
}
