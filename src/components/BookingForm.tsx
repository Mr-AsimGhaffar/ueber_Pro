import React from 'react';
import { Form, Input, Select, DatePicker, TimePicker, InputNumber } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;

export interface BookingFormData {
  carName: string;
  rentalType: string;
  pickupLocation: string;
  pickupDate: Date;
  pickupTime: Date;
  dropoffLocation: string;
  dropoffDate: Date;
  dropoffTime: Date;
  total: number;
}

interface Props {
  form: FormInstance;
}

export default function BookingForm({ form }: Props) {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        rentalType: 'Hourly',
      }}
    >
      <Form.Item
        name="carName"
        label="Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Select placeholder="Select a car">
          <Option value="Ferrari 458 MM Speciale">Ferrari 458 MM Speciale</Option>
          <Option value="Toyota Camry SE 350">Toyota Camry SE 350</Option>
          <Option value="Kia Soul 2016">Kia Soul 2016</Option>
          <Option value="Audi A3 2019">Audi A3 2019</Option>
          <Option value="Chevrolet Camaro">Chevrolet Camaro</Option>
          <Option value="Acura Sport Version">Acura Sport Version</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="rentalType"
        label="Rental Type"
        rules={[{ required: true, message: 'Please select rental type' }]}
      >
        <Select>
          <Option value="Hourly">Hourly</Option>
          <Option value="Day">Day</Option>
          <Option value="Weekly">Weekly</Option>
          <Option value="Monthly">Monthly</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="pickupLocation"
        label="Pickup Location"
        rules={[{ required: true, message: 'Please enter pickup location' }]}
      >
        <Input placeholder="Enter city, airport, or address" />
      </Form.Item>

      <Form.Item
        name="pickupDate"
        label="Pickup Date"
        rules={[{ required: true, message: 'Please select pickup date' }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item
        name="pickupTime"
        label="Pickup Time"
        rules={[{ required: true, message: 'Please select pickup time' }]}
      >
        <TimePicker className="w-full" format="HH:mm" />
      </Form.Item>

      <Form.Item
        name="dropoffLocation"
        label="Drop-off Location"
        rules={[{ required: true, message: 'Please enter drop-off location' }]}
      >
        <Input placeholder="Enter city, airport, or address" />
      </Form.Item>

      <Form.Item
        name="dropoffDate"
        label="Drop-off Date"
        rules={[{ required: true, message: 'Please select drop-off date' }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item
        name="dropoffTime"
        label="Drop-off Time"
        rules={[{ required: true, message: 'Please select drop-off time' }]}
      >
        <TimePicker className="w-full" format="HH:mm" />
      </Form.Item>

      <Form.Item
        name="total"
        label="Total Amount"
        rules={[{ required: true, message: 'Please enter total amount' }]}
      >
        <InputNumber
          className="w-full"
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
    </Form>
  );
}