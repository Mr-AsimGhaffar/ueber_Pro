import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Upload, Button, Switch, Select, DatePicker } from "antd";
import { LockOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";

interface UserTripProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

interface PricingModel {
  id: number;
  model: string;
}

interface Location {
  id: string;
  place: string;
  lat: number;
  lng: number;
  type: "start" | "end" | "waypoint";
}

export default function TripForm({
  onSubmit,
  onCancel,
  initialValues,
}: UserTripProps) {
  const [form] = Form.useForm();

  const [tripModelName, setTripModelName] = useState<PricingModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPriceField, setShowPriceField] = useState(true);

  // Set the form's fields to initialValues when editing
  useEffect(() => {
    if (initialValues) {
      const startTime = dayjs(initialValues.startTime);
      form.setFieldsValue({
        ...initialValues,
        profilePictureId: initialValues?.profilePictureId || "",
        startTime: startTime.isValid() ? startTime : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.profilePictureId?.file) {
        values.profilePictureId =
          values.profilePictureId.file.response?.url || ""; // Adjust based on your file upload API response
      }
      const offeredPriceInCents = Math.round(values.cost * 100);
      onSubmit({
        ...values,
        offeredPrice: offeredPriceInCents,
      });
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
        <div className="md:col-span-2 text-center">
          <h1 className="font-medium text-base">Trip Offers</h1>
        </div>

        {/* {showPriceField && ( */}
        <Form.Item
          name="offeredPrice"
          label="Offered Price"
          rules={[{ required: true, message: "Please enter a price" }]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit Offer
        </Button>
      </div>
    </Form>
  );
}
