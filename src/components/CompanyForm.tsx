import React, { useEffect, useRef } from "react";
import { Form, Input, Upload, Button, Switch } from "antd";
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
  const statusRef = useRef<HTMLSpanElement>(null);

  // Set the form's fields to initialValues when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        companyLogo: initialValues?.companyLogo || "",
        status: initialValues?.status == "ACTIVE",
      });
    } else {
      form.resetFields(); // Reset the form when initialValues is null (add new company)
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.companyLogo?.file) {
        values.companyLogo = values.companyLogo.file.response?.url || ""; // Adjust based on your file upload API response
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
            {initialValues ? "Edit Company" : "Add New Company"}
          </h1>
          <h3 className="font-medium mb-4">Company Information</h3>
        </div>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please enter company type" }]}
        >
          <Input placeholder="Enter company type" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input.TextArea rows={1} placeholder="Enter address" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Contact Number"
          rules={[{ required: true, message: "Please enter contact number" }]}
        >
          <Input placeholder="Enter contact number" />
        </Form.Item>
        <Form.Item
          name="createdBy"
          label="Created By"
          //   rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          name="status"
          label={
            <div>
              Status: <span ref={statusRef}>Active</span>
            </div>
          }
          rules={[{ required: true, message: "Please enter company status" }]}
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
