import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Upload, Button, Switch, Select } from "antd";
import { LockOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface DriverFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}
interface Driver {
  id: number;
  name: string;
}

export default function DriverForm({
  onSubmit,
  onCancel,
  initialValues,
}: DriverFormProps) {
  const [form] = Form.useForm();
  const [driverName, setDriverName] = useState<Driver[]>([]);
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
          setDriverName(data.data); // Assuming API response has `data` with company list
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
      const { user, status } = initialValues;
      form.setFieldsValue({
        ...user,
        status: status || "AVAILABLE",
        nic: user?.nic || initialValues.nic || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : undefined,
        licenseExpiryDate: initialValues.licenseExpiryDate
          ? new Date(initialValues.licenseExpiryDate)
              .toISOString()
              .split("T")[0]
          : undefined,
        contacts: user.contacts ? String(user.contacts) : "",
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
      values.userId = initialValues?.userId;

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
            {initialValues?.id ? "Edit Driver" : "Add New Driver"}
          </h1>
          <h3 className="font-medium mb-4">Driver Information</h3>
        </div>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: "Please enter first name" },
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
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: "Please enter last name" },
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
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
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
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long and include upper and lower case letters and a number",
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
                    return Promise.reject(new Error("Passwords do not match!"));
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
              pattern: /^[0-9]{10,15}$/,
              message: "Please enter a valid contact number (10-15 digits)",
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
            showSearch
            placeholder="Select a company"
            loading={loading}
            options={driverName.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          name="nic"
          label="CNIC"
          rules={[
            { required: true, message: "Please enter CNIC" },
            {
              pattern: /^[0-9]{13}$/,
              message: "Please enter a valid CNIC (13 digits)",
            },
          ]}
        >
          <Input placeholder="Enter CNIC" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select Status">
            <Select.Option value="AVAILABLE">Available</Select.Option>
            <Select.Option value="ON_LEAVE">On Leave</Select.Option>
            <Select.Option value="SUSPENDED">Suspended</Select.Option>
            <Select.Option value="OFF_DUTY">Off Duty</Select.Option>
            <Select.Option value="ON_TRIP">On Trip</Select.Option>
          </Select>
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
          {initialValues?.id ? "Update Driver" : "Add Driver"}
        </Button>
      </div>
    </Form>
  );
}
