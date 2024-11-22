import React, { useEffect, useRef } from "react";
import { Form, Input, Upload, Button, Switch, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface CompanyFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function CompanyForm({
  onSubmit,
  onCancel,
  initialValues,
}: CompanyFormProps) {
  const [form] = Form.useForm();

  // Set the form's fields to initialValues when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        logo: initialValues?.logo || "",

        contacts: initialValues.contacts ? String(initialValues.contacts) : "",
      });
    } else {
      form.resetFields(); // Reset the form when initialValues is null (add new company)
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.logo?.file) {
        values.logo = values.logo.file.response?.url || ""; // Adjust based on your file upload API response
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
            {initialValues ? "Edit Company" : "Add New Company"}
          </h1>
        </div>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please enter company name" },
            {
              min: 2,
              message: "Company name must be at least 2 characters long",
            },
            {
              max: 100,
              message: "Company name must be at most 100 characters long",
            },
            {
              pattern: /^[a-zA-Z0-9\s]+$/,
              message:
                "Company name can only contain letters, numbers, and spaces",
            },
          ]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select a Type" }]}
        >
          <Select placeholder="Select Type">
            <Select.Option value="ANY">Any</Select.Option>
            <Select.Option value="CARS">Cars</Select.Option>
            <Select.Option value="DRIVERS">Drivers</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[
            { required: true, message: "Please enter address" },
            { min: 10, message: "Address must be at least 10 characters long" },
            {
              max: 200,
              message: "Address must be at most 200 characters long",
            },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Please enter a valid email" }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="contact"
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
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select Status">
            <Select.Option value="ACTIVE">Active</Select.Option>
            <Select.Option value="IN_ACTIVE">Inactive</Select.Option>
          </Select>
        </Form.Item>

        {/* Document Upload */}
        {/* <div className="md:col-span-2">
          <h3 className="font-medium mb-4 mt-4">Documents</h3>
        </div> */}

        {/* <Form.Item
          name="logo"
          label="Logo"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[
            { required: true, message: "Please upload company logo" },
            { max: 1, message: "You can upload only one logo" },
          ]}
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
          {initialValues ? "Update Company" : "Add Company"}
        </Button>
      </div>
    </Form>
  );
}
