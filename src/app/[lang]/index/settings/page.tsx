import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import Profile from "@/components/settings/Profile";
import Security from "@/components/settings/Security";
import Notifications from "@/components/settings/Notifications";
import Integration from "@/components/settings/Integration";
import { User } from "@/lib/definitions";
import { UserProvider } from "@/hooks/context/AuthContext";
import { getUser } from "@/lib/data";
// import { UserProvider, useUser } from "@/hooks/context/AuthContext";

type MenuKey = "profile" | "security" | "notifications" | "integration";

export default async function SettingsPage() {
  const user = await getUser();
  // const [selectedKey, setSelectedKey] = useState<MenuKey>("profile");
  // const { user } = useUser();

  // const menuItems = [
  //   {
  //     key: "profile",
  //     icon: <UserOutlined />,
  //     label: "Profile",
  //   },
  //   {
  //     key: "security",
  //     icon: <LockOutlined />,
  //     label: "Security",
  //   },
  //   {
  //     key: "notifications",
  //     icon: <BellOutlined />,
  //     label: "Notifications",
  //   },
  //   {
  //     key: "integration",
  //     icon: <ApiOutlined />,
  //     label: "Integration",
  //   },
  // ];

  const renderContent = () => {
    // switch (selectedKey) {
    //   case "profile":
    return <Profile />;
    // case "security":
    //   return <Security />;
    // case "notifications":
    //   return <Notifications />;
    // case "integration":
    //   return <Integration />;
    // default:
    //   return <Profile />;
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* <div className="w-64 border-r border-gray-200 bg-white">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key as MenuKey)}
          className="h-full"
        />
      </div> */}
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <UserProvider initialUser={user}>{renderContent()}</UserProvider>
      </div>
    </div>
  );
}
