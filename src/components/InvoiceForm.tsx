import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";

interface InvoiceFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

interface Trip {
  id: number;
  unixId: string;
  driverCompanyId: number;
}
interface Account {
  id: number;
  accountNumber: string;
}

export default function InvoiceForm({
  onSubmit,
  onCancel,
  initialValues,
}: InvoiceFormProps) {
  const [form] = Form.useForm();
  const [tripName, setTripName] = useState<Trip[]>([]);
  const [bankAccountName, setBankAccountName] = useState<Account[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          filters: JSON.stringify({
            status: "COMPLETED",
          }),
        }).toString();
        const response = await fetch(`/api/listTrips?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTripName(data.data);
        } else {
          console.error("Failed to fetch trips");
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    const fetchAccounts = async (trip: number) => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          filters: JSON.stringify({
            companyId: tripName.find((t) => t.id === trip)?.driverCompanyId,
          }),
        }).toString();
        const response = await fetch(`/api/account/listAccount?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBankAccountName(data.data);
        } else {
          console.error("Failed to fetch accounts");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedTrip) fetchAccounts(selectedTrip);
  }, [selectedTrip]);

  // Set the form's fields to initialValues when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dueDate: initialValues.dueDate
          ? new Date(initialValues.dueDate).toISOString().split("T")[0]
          : undefined,
      });
    } else {
      form.resetFields(); // Reset the form when initialValues is null (add new account)
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.dueDate = values.dueDate
        ? new Date(values.dueDate).toISOString()
        : undefined;
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
            {initialValues ? "Edit Invoice" : "Add New Invoice"}
          </h1>
        </div>
        {!initialValues && (
          <>
            <Form.Item
              name="tripId"
              label="Trip Name"
              rules={[{ required: true, message: "Please select a trip" }]}
            >
              <Select
                showSearch
                placeholder="Select a trip"
                loading={loading}
                options={tripName.map((trip) => ({
                  value: trip.id,
                  label: trip.unixId,
                }))}
                onChange={setSelectedTrip}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              name="bankAccountId"
              label="Bank Account"
              rules={[
                { required: true, message: "Please select a bank account" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a bank account"
                loading={loading}
                options={bankAccountName.map((bankName) => ({
                  value: bankName.id,
                  label: bankName.accountNumber,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[
                { required: true, message: "Please enter due date" },
                {
                  validator: (_, value) =>
                    value && new Date(value) >= new Date()
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Due date must be in the future")
                        ),
                },
              ]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter Description" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>
          </>
        )}
        {initialValues && (
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select Status">
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="PAID">Paid</Select.Option>
              <Select.Option value="CANCELLED">Cancelled</Select.Option>
              <Select.Option value="OVERDUE">Overdue</Select.Option>
            </Select>
          </Form.Item>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          {initialValues ? "Update Invoice" : "Add Invoice"}
        </Button>
      </div>
    </Form>
  );
}
