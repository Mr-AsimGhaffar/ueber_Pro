import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Upload, Button, Switch, Select } from "antd";
import { LockOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { Car } from "@/lib/definitions";

interface CarFormProps {
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
}: CarFormProps) {
  const [form] = Form.useForm();
  const [CarName, setCarName] = useState<Company[]>([]);
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
          setCarName(data.data); // Assuming API response has `data` with company list
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
        profilePictureId: initialValues?.profilePictureId || "",
      });
    } else {
      form.resetFields(); // Reset the form when initialValues is null (add new company)
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-workSans">
        {/* Company Information */}
        <div className="md:col-span-2">
          <h1 className="font-medium text-base text-center mb-2">
            {" "}
            {initialValues ? "Edit Car" : "Add New Car"}
          </h1>
          <h3 className="font-medium mb-4 text-left">Car Information</h3>
        </div>

        <Form.Item
          name="carModel"
          label="Car Model Name"
          rules={[
            { required: true, message: "Please enter Car name" },
            {
              min: 2,
              message: "Car name must be at least 2 characters long",
            },
            {
              max: 50,
              message: "Car name must be at most 50 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "Car name must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter Car name" />
        </Form.Item>

        <Form.Item
          name="carBrand"
          label="Car Brand Name"
          rules={[
            { required: true, message: "Please enter Car name" },
            {
              min: 2,
              message: "Car name must be at least 2 characters long",
            },
            {
              max: 50,
              message: "Car name must be at most 50 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "Car name must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter Car name" />
        </Form.Item>

        <Form.Item
          name="registrationNumber"
          label="Registration Number"
          rules={[
            { required: true, message: "Please enter Registration Number" },
            {
              min: 2,
              message: "Registration Number must be at least 2 characters long",
            },
            {
              max: 50,
              message: "Registration Number must be at most 50 characters long",
            },
          ]}
        >
          <Input placeholder="Enter Registration Number" />
        </Form.Item>
        <Form.Item
          name="transmission"
          label="Transmission"
          rules={[{ required: true, message: "Please select a transmission" }]}
        >
          <Select placeholder="Select transmission">
            <Select.Option value="AUTOMATIC">Automatic</Select.Option>
            <Select.Option value="MANUAL">Manul</Select.Option>
            <Select.Option value="SEMI_AUTOMATIC">Semi Automatic</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: "Please select Year" }]}
        >
          <Input placeholder="Enter Year" />
        </Form.Item>

        <Form.Item
          name="carCategory"
          label="Car Category"
          rules={[{ required: true, message: "Please enter Car Category" }]}
        >
          <Input placeholder="Enter Car Category" />
        </Form.Item>
        <Form.Item
          name="carFuelType"
          label="Car Fuel Type"
          rules={[{ required: true, message: "Please enter Car Fuel Type" }]}
        >
          <Input placeholder="Enter Car Fuel Type" />
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
            options={CarName.map((car) => ({
              value: car.id,
              label: car.name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select Status">
            <Select.Option value="AVAILABLE">Available</Select.Option>
            <Select.Option value="IN_USE">In Use</Select.Option>
            <Select.Option value="MAINTENANCE">Maintenance</Select.Option>
          </Select>
        </Form.Item>

        {/* Rental Pricing */}

        <div className="md:col-span-2">
          <h3 className="font-medium mb-4">Rental Pricing</h3>
          <div className="flex gap-4">
            <Form.Item
              name="hourlyRate"
              label="Hourly Rate"
              rules={[{ required: true, message: "Please enter Hourly Rate" }]}
              className="flex-1"
            >
              <Input placeholder="Enter hourly rate" />
            </Form.Item>
            <Form.Item
              name="dailyRate"
              label="Daily Rate"
              rules={[{ required: true, message: "Please enter daily rate" }]}
              className="flex-1"
            >
              <Input placeholder="Enter daily rate" />
            </Form.Item>
            <Form.Item
              name="weeklyRate"
              label="Weekly Rate"
              rules={[{ required: true, message: "Please enter weekly rate" }]}
              className="flex-1"
            >
              <Input placeholder="Enter weekly rate" />
            </Form.Item>
            <Form.Item
              name="monthlyRate"
              label="Monthly Rate"
              rules={[{ required: true, message: "Please enter monthly rate" }]}
              className="flex-1"
            >
              <Input placeholder="Enter monthly rate" />
            </Form.Item>
          </div>
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
          {initialValues ? "Update Car" : "Add Car"}
        </Button>
      </div>
    </Form>
  );
}
