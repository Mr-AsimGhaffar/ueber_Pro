import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";

interface AccountFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

interface Account {
  id: number;
  name: string;
}

export default function AccountForm({
  onSubmit,
  onCancel,
  initialValues,
}: AccountFormProps) {
  const [form] = Form.useForm();

  const [accountName, setAccountName] = useState<Account[]>([]);
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
          setAccountName(data.data); // Assuming API response has `data` with company list
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
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields(); // Reset the form when initialValues is null (add new account)
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
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
        {/* Account Information */}
        <div className="md:col-span-2 text-center">
          <h1 className="font-medium text-base">
            {" "}
            {initialValues ? "Edit Account" : "Add New Account"}
          </h1>
        </div>

        <Form.Item
          name="accountNumber"
          label="Account Number"
          rules={[
            { required: true, message: "Please enter Account Number" },
            {
              min: 2,
              message: "Account Number must be at least 2 characters long",
            },
            {
              max: 100,
              message: "Account Number must be at most 100 characters long",
            },
            {
              pattern: /^[a-zA-Z0-9\s]+$/,
              message:
                "Account Number can only contain letters, numbers, and spaces",
            },
          ]}
        >
          <Input placeholder="Enter Account Number" />
        </Form.Item>

        <Form.Item
          name="bankName"
          label="Bank Name"
          rules={[
            { required: true, message: "Please enter bank name" },
            {
              min: 10,
              message: "bank name must be at least 10 characters long",
            },
            {
              max: 200,
              message: "bank name must be at most 200 characters long",
            },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Enter bank name" />
        </Form.Item>

        <Form.Item
          name="accountHolderName"
          label="Account Holder Name"
          rules={[
            { required: true, message: "Please enter Account Holder Name" },
            {
              min: 10,
              message:
                "Account Holder Name must be at least 10 characters long",
            },
            {
              max: 200,
              message:
                "Account Holder Name must be at most 200 characters long",
            },
          ]}
        >
          <Input placeholder="Enter Account Holder Name" />
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
            options={accountName.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          {initialValues ? "Update Account" : "Add Account"}
        </Button>
      </div>
    </Form>
  );
}
