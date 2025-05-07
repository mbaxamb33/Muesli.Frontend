import {
  HelpCircleIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UsersIcon,
  BriefcaseIcon,
  FolderIcon,
  CheckSquareIcon,
  CalendarIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../../components/components/button";
import { Switch } from "../../components/components/switch";
import { useTheme } from "../../context/ThemeContext";

export const Desktop = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Define menu items for better organization and maintainability
  const mainMenuItems = [
    {
      icon: <LayoutDashboardIcon className="w-4 h-4" />,
      label: "Dashboard",
      active: true,
    },
    { icon: <UsersIcon className="w-4 h-4" />, label: "Clients" },
    { icon: <BriefcaseIcon className="w-4 h-4" />, label: "Opportunities" },
    { icon: <FolderIcon className="w-4 h-4" />, label: "Projects" },
    { icon: <CheckSquareIcon className="w-4 h-4" />, label: "Tasks" },
    { icon: <CalendarIcon className="w-4 h-4" />, label: "Meetings" },
  ];

  const bottomMenuItems = [
    { icon: <SettingsIcon className="w-4 h-4" />, label: "Settings" },
    { icon: <LogOutIcon className="w-4 h-4" />, label: "Sign out" },
    { icon: <HelpCircleIcon className="w-4 h-4" />, label: "Help" },
  ];

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex flex-row justify-center w-full min-h-screen transition-colors duration-300`}>
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} w-full min-h-screen transition-colors duration-300`}>
        <aside className={`relative w-60 h-screen ${isDark ? 'bg-[#17162e]' : 'bg-white'} flex flex-col transition-colors duration-300`}>
          {/* Logo Header */}
          <header className={`w-full h-[67px] border-b ${isDark ? 'border-opacity-20 border-gray-500' : 'border-gray-200'} transition-colors duration-300 flex items-center px-4`}>
            <h1 
              className={`
                cursor-pointer
                font-bold
                text-2xl
                leading-[33.6px]
                ${isDark ? 'text-white' : 'text-gray-800'}
                transition-colors duration-300
                w-full
                text-left
              `}
              style={{ 
                fontFamily: 'itc-avant-garde-gothic-pro, sans-serif',
                letterSpacing: 'normal',
                textDecorationLine: 'none',
                opacity: 1,
                fontWeight: 700 // Increased boldness
              }}
            >
              PANTOPIA
            </h1>
          </header>

          {/* Main content of sidebar */}
          <div className="flex flex-col flex-1 px-4 py-8">
            {/* Main navigation menu */}
            <nav className="mb-8">
              {mainMenuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`w-full mb-3 h-[31px] justify-start px-2 py-1.5 rounded-lg transition-colors duration-300 ${
                    item.active
                      ? isDark 
                        ? "bg-[#201e3d] text-white" 
                        : "bg-blue-100 text-blue-700"
                      : isDark
                        ? "text-neutral-100 hover:bg-[#201e3d] hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                  }`}
                >
                  <span className={`${
                    item.active 
                      ? isDark ? "text-white" : "text-blue-700"
                      : isDark ? "text-neutral-100" : "text-gray-700"
                  } transition-colors duration-300`}>
                    {item.icon}
                  </span>
                  <span className="ml-2 font-normal text-sm tracking-[-0.56px]">
                    {item.label}
                  </span>
                </Button>
              ))}
            </nav>

            {/* Spacer to push bottom items to the bottom */}
            <div className="flex-grow"></div>

            {/* Bottom menu items */}
            <div className="mt-auto mb-4">
              {bottomMenuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`w-full mb-3 h-[31px] justify-start px-2 py-1.5 rounded-lg transition-colors duration-300 ${
                    isDark
                      ? "text-neutral-100 hover:bg-[#201e3d] hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                  }`}
                >
                  <span className={`${isDark ? "text-neutral-100" : "text-gray-700"} transition-colors duration-300`}>
                    {item.icon}
                  </span>
                  <span className="ml-2 font-normal text-sm tracking-[-0.56px]">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>

            {/* Dark mode toggle */}
            <div className="w-full h-[31px] rounded-lg overflow-hidden flex items-center justify-between px-2 mb-4">
              <div className="flex items-center">
                {isDark ? (
                  <MoonIcon className={`w-4 h-4 ${isDark ? 'text-neutral-100' : 'text-gray-700'} transition-colors duration-300`} />
                ) : (
                  <SunIcon className={`w-4 h-4 ${isDark ? 'text-neutral-100' : 'text-gray-700'} transition-colors duration-300`} />
                )}
                <span className={`ml-2 font-normal ${isDark ? 'text-neutral-100' : 'text-gray-700'} text-sm tracking-[-0.56px] transition-colors duration-300`}>
                  {isDark ? 'Dark mode' : 'Light mode'}
                </span>
              </div>
              <Switch
                className="data-[state=checked]:bg-[#14ea29]"
                checked={isDark}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};