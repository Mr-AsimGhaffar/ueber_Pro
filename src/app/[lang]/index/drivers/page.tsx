"use client";

import React, { useState } from 'react';
import { Button, Table, Tag, Modal, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DriverForm from '@/components/DriverForm';

interface Driver {
  key: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  expiryDate: string;
  status: 'active' | 'inactive';
  verified: boolean;
}

const initialDrivers: Driver[] = [
  {
    key: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234-567-8900',
    licenseNumber: 'DL123456',
    expiryDate: '2025-12-31',
    status: 'active',
    verified: true,
  },
  {
    key: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234-567-8901',
    licenseNumber: 'DL789012',
    expiryDate: '2024-10-15',
    status: 'inactive',
    verified: false,
  },
];

export default function DriversPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);

  const columns: ColumnsType<Driver> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'License Number',
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified: boolean) => (
        <Tag color={verified ? 'blue' : 'orange'}>
          {verified ? 'VERIFIED' : 'PENDING'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleAddDriver = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (driver: Driver) => {
    // Implement edit functionality
    console.log('Edit driver:', driver);
  };

  const handleModalOk = (values: any) => {
    const newDriver: Driver = {
      key: String(drivers.length + 1),
      ...values,
      status: 'active',
      verified: false,
    };
    setDrivers([...drivers, newDriver]);
    message.success('Driver added successfully');
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Drivers Management</h1>
        <Button 
          type="primary" 
          size="large"
          icon={<UserAddOutlined />}
          onClick={handleAddDriver}
        >
          Add Driver
        </Button>
      </div>

      <Table columns={columns} dataSource={drivers} />

      <Modal
        title="Add New Driver"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={720}
      >
        <DriverForm onSubmit={handleModalOk} onCancel={handleModalCancel} />
      </Modal>
    </div>
  );
}