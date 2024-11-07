import React, { Suspense } from "react";
import {
  CalendarOutlined,
  CreditCardOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Card, Badge, Select } from "antd";

import { getIntl } from "@/lib/intl";
import { Locale } from "@/lib/definitions";
import { getActivities, getTeamMembers } from "@/lib/data";
import DashboardTable from "../../components/DashboardTable";
import Spinner from "@/components/Spinner";

interface StatCardProps {
  title: string;
  value: string;
  link: string;
  href: string;
  icon: JSX.Element;
  iconBg: string;
}

// interface BookingItemProps {
//   car: string;
//   rentType: string;
//   startDate: string;
//   endDate: string;
//   price: string;
//   status: string;
// }

interface TransactionItemProps {
  car: string;
  carImage: string;
  rentType: string;
  status: "Upcoming" | "Inprogress" | "Completed" | "Cancelled" | string;
  date: string;
}

interface Props {
  params: {
    lang: Locale;
  };
}
// interface Booking {
//   id: string;
//   carImage: string;
//   carName: string;
//   rentType: string;
//   startDate: string;
//   endDate: string;
//   price: string; // Price as a string
//   status: "upcoming" | "inprogress" | "completed";
// }

export default function Page({ params: { lang: locale } }: Props) {
  return (
    <Suspense fallback={<Spinner />}>
      <PageContent locale={locale} />
    </Suspense>
  );
}

interface PageContentProps {
  locale: Locale;
}

async function PageContent({ locale }: PageContentProps) {
  const intl = await getIntl(locale);
  const teamMembers = await getTeamMembers();
  const activities = await getActivities();

  return (
    <main className="container mx-auto space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Bookings"
          value="450"
          link="View all Bookings"
          href={"/index/bookings"}
          icon={<CalendarOutlined className="text-4xl text-white" />}
          iconBg="bg-teal-600 "
        />
        <StatCard
          title="In Progress Transactions"
          value="$24,665"
          link="View Balance"
          href="#"
          icon={<CreditCardOutlined className="text-4xl w-8 h-8 text-white" />}
          iconBg="bg-orange-500"
        />
        <StatCard
          title="Total Transactions"
          value="$15,210"
          link="View all Transactions"
          href="#"
          icon={<CreditCardOutlined className="text-4xl w-8 h-8 text-white" />}
          iconBg="bg-green-500"
        />
        <StatCard
          title="Wishlist Cars"
          value="24"
          link="Go to Wishlist"
          href="#"
          icon={<HeartOutlined className="text-4xl w-8 h-8 text-white" />}
          iconBg="bg-red-500"
        />
      </div>

      {/* Bookings and Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Last 5 Bookings */}
        <Card className="col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Last 5 Bookings</h2>
            <div className="flex items-center gap-4">
              <Select defaultValue="30" style={{ width: 180 }}></Select>
              <a
                href={"/index/bookings"}
                className="text-blue-600 hover:underline"
              >
                View all Bookings
              </a>
            </div>
          </div>
          {/* <div className="space-y-4">
            {bookings.map((booking, index) => (
              <BookingItem key={index} {...booking} />
            ))}
          </div> */}
          {/* <Table dataSource={bookings} columns={columns} /> */}
          <DashboardTable />
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Transaction</h2>
            <Select defaultValue="30" style={{ width: 180 }}></Select>
          </div>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <TransactionItem key={index} {...transaction} />
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

function StatCard({ title, value, link, href, icon, iconBg }: StatCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 mb-2">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          {/* <a
            href={href}
            className="text-blue-600 hover:underline text-sm mt-2 block"
          >
            {link} →
          </a> */}
        </div>
        <div className={`rounded-full p-4 ${iconBg}`}>{icon}</div>
      </div>
    </Card>
  );
}

// function BookingItem({
//   car,
//   rentType,
//   startDate,
//   endDate,
//   price,
//   status,
// }: BookingItemProps) {
//   return (
//     <div className="flex items-center justify-between p-4 border rounded-lg">
//       <div className="flex items-center gap-4">
//         <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
//           <img
//             src="path-to-your-car-image.jpg"
//             alt="Car"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div>
//           <h4 className="font-semibold">{car}</h4>
//           <p className="text-sm text-gray-600">Rent Type: {rentType}</p>
//         </div>
//       </div>
//       <div className="text-right">
//         <div className="text-sm text-gray-600">
//           {startDate} - {endDate}
//         </div>
//         <div className="font-semibold text-red-500">${price}</div>
//         <Badge color={getBadgeColor(status)} className="mt-1">
//           {status}
//         </Badge>
//       </div>
//     </div>
//   );
// }

function TransactionItem({
  car,
  carImage,
  rentType,
  status,
  date,
}: TransactionItemProps) {
  const statusClasses: Record<TransactionItemProps["status"], string> = {
    Upcoming: "text-yellow-600 bg-yellow-100 font-bold p-1 rounded-lg",
    Inprogress: "text-blue-600 bg-blue-100 font-bold p-1 rounded-lg",
    Completed: "text-green-600 bg-green-100 font-bold p-1 rounded-lg",
    Cancelled: "text-red-600 bg-red-100 font-bold p-1 rounded-lg",
  };
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={carImage}
            alt={car}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm md:text-base font-semibold">{car}</h4>
          <p className="text-sm text-gray-600">Rent Type: {rentType}</p>
        </div>
      </div>
      <div className={`${statusClasses[status]}`}>{status}</div>
    </div>
  );
}

// const bookings = [
//   {
//     key: "1",
//     car: "Ferrari 458 MM Speciale",
//     rentType: "Hourly",
//     startDate: "15 Sep 2023, 11:30 PM",
//     endDate: "15 Sep 2023, 1:30 PM",
//     price: "200",
//     status: "Upcoming",
//   },
//   {
//     key: "2",
//     car: "Kia Soul 2016",
//     rentType: "Hourly",
//     startDate: "15 Sep 2023, 09:00 AM",
//     endDate: "15 Sep 2023, 1:30 PM",
//     price: "300",
//     status: "Upcoming",
//   },
//   {
//     key: "3",
//     car: "Toyota Camry SE 350",
//     rentType: "Day",
//     startDate: "18 Sep 2023, 09:00 AM",
//     endDate: "18 Sep 2023, 05:00 PM",
//     price: "600",
//     status: "Inprogress",
//   },
//   {
//     key: "4",
//     car: "Audi A3 2019 new",
//     rentType: "Weekly",
//     startDate: "10 Oct 2023, 10:30 AM",
//     endDate: "16 Oct 2023, 10:30 AM",
//     price: "800",
//     status: "Completed",
//   },
//   {
//     key: "5",
//     car: "2018 Chevrolet Camaro",
//     rentType: "Hourly",
//     startDate: "14 Nov 2023, 02:00 PM",
//     endDate: "14 Nov 2023, 04:00 PM",
//     price: "240",
//     status: "Completed",
//   },
// ];

// const columns = [
//   {
//     title: "Car",
//     dataIndex: "car",
//     key: "car",
//     render: (record: Booking) => (
//       <div className="flex items-center gap-4">
//         <img
//           src={record.carImage}
//           alt={record.carName}
//           className="w-12 h-12 object-cover"
//         />
//         <div>
//           <p className="font-semibold">{record.carName}</p>
//           <p className="text-sm text-gray-500">{record.rentType}</p>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: "Start Date",
//     dataIndex: "startDate",
//     key: "startDate",
//   },
//   {
//     title: "End Date",
//     dataIndex: "endDate",
//     key: "endDate",
//   },
//   {
//     title: "Price",
//     dataIndex: "price",
//     key: "price",
//   },
//   {
//     title: "Status",
//     dataIndex: "status",
//     key: "status",
//   },
// ];

const transactions = [
  {
    car: "Ferrari 458 MM Speciale",
    carImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    rentType: "Hourly",
    status: "Upcoming",
    date: "On 15 Sep 2023, 11:30 PM",
  },
  {
    car: "Kia Soul 2016",
    carImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    rentType: "Hourly",
    status: "Upcoming",
    date: "On 15 Sep 2023, 09:00 AM",
  },
  {
    car: "Toyota Camry SE 350",
    carImage: "https://images.unsplash.com/photo-1542362567-b07e54358753",
    rentType: "Day",
    status: "Inprogress",
    date: "On 18 Sep 2023, 09:00 AM",
  },
  {
    car: "Audi A3 2019 new",
    carImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    rentType: "Weekly",
    status: "Cancelled",
    date: "On 10 Oct 2023, 10:30 AM",
  },
  {
    car: "2018 Chevrolet Camaro",
    carImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    rentType: "Hourly",
    status: "Completed",
    date: "On 14 Nov 2023, 02:00 PM",
  },
];
