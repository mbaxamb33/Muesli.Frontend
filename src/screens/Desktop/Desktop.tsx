import {
  ActivityIcon,
  ClipboardIcon,
  EyeIcon,
  HelpCircleIcon,
  LogOutIcon,
  MoonIcon,
  PieChartIcon,
  RepeatIcon,
  SettingsIcon,
  SunIcon,
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
      icon: <PieChartIcon className="w-4 h-4" />,
      label: "Dashboard",
      active: true,
    },
    { icon: <ActivityIcon className="w-4 h-4" />, label: "Pools" },
    { icon: <RepeatIcon className="w-4 h-4" />, label: "Swap" },
  ];

  const accountMenuItems = [
    {
      icon: (
        <img
          className="w-4 h-4"
          alt="Group"
          src="https://c.animaapp.com/macgsy7nnXUdJ6/img/group.png"
        />
      ),
      label: "Portfolio",
    },
    { icon: <ClipboardIcon className="w-4 h-4" />, label: "History" },
    { icon: <SettingsIcon className="w-4 h-4" />, label: "Settings" },
  ];

  const bottomMenuItems = [
    { icon: <LogOutIcon className="w-4 h-4" />, label: "Sign out" },
    { icon: <HelpCircleIcon className="w-4 h-4" />, label: "Help" },
  ];

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex flex-row justify-center w-full min-h-screen transition-colors duration-300`}>
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} w-full min-h-screen transition-colors duration-300`}>
        <aside className={`relative w-60 h-screen ${isDark ? 'bg-[#17162e]' : 'bg-white'} flex flex-col transition-colors duration-300`}>
          {/* Header with wallet info */}
          <header className={`w-full h-[67px] border-b ${isDark ? 'border-opacity-20 border-gray-500' : 'border-gray-200'} transition-colors duration-300`}>
            <div className="p-4 flex items-center">
              <div className={`w-6 h-6 ${isDark ? 'bg-[#221f3b]' : 'bg-gray-200'} rounded-xl flex items-center justify-center transition-colors duration-300`}>
                <img
                  className="w-[11px] h-[11px]"
                  alt="Group"
                  src="https://c.animaapp.com/macgsy7nnXUdJ6/img/group-30.png"
                />
              </div>

              <div className="ml-2">
                <div className={`[font-family:'Segoe_UI-Regular',Helvetica] font-normal ${isDark ? 'text-[#f0f0f0]' : 'text-gray-800'} text-sm tracking-[-0.56px] transition-colors duration-300`}>
                  0x34...3214
                </div>

                <div className="flex items-center">
                  <div className={`[font-family:'Segoe_UI-Regular',Helvetica] font-normal ${isDark ? 'text-[#bdbdbd]' : 'text-gray-600'} text-xs tracking-[-0.48px] transition-colors duration-300`}>
                    $54,212.52
                  </div>
                  <EyeIcon className={`ml-1 w-3 h-3 ${isDark ? 'text-[#bdbdbd]' : 'text-gray-600'} transition-colors duration-300`} />
                </div>
              </div>
            </div>
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
                  <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-sm tracking-[-0.56px]">
                    {item.label}
                  </span>
                </Button>
              ))}
            </nav>

            {/* Account section */}
            <div className={`mb-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal ${isDark ? 'text-[#c4c3d1]' : 'text-gray-500'} text-[13px] tracking-[-0.52px] transition-colors duration-300`}>
              Account
            </div>

            {/* Account menu items */}
            <nav className="mb-8">
              {accountMenuItems.map((item) => (
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
                  <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-sm tracking-[-0.56px]">
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
                  <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-sm tracking-[-0.56px]">
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
                <span className={`ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal ${isDark ? 'text-neutral-100' : 'text-gray-700'} text-sm tracking-[-0.56px] transition-colors duration-300`}>
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