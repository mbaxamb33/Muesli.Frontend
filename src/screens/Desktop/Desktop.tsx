import {
    ActivityIcon,
    ClipboardIcon,
    EyeIcon,
    HelpCircleIcon,
    LogOutIcon,
    PieChartIcon,
    RepeatIcon,
    SettingsIcon,
    SunIcon,
  } from "lucide-react";
  import React from "react";
  import { Button } from "../../components/components/button";
  import { Switch } from "../../components/components/switch";
  
  export const Desktop = (): JSX.Element => {
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
      <div className="bg-[#100e24] flex flex-row justify-center w-full min-h-screen">
        <div className="bg-[#100e24] w-full min-h-screen">
          <aside className="relative w-60 h-screen bg-[#17162e] flex flex-col">
            {/* Header with wallet info */}
            <header className="w-full h-[67px] border-b border-opacity-20 border-gray-500">
              <div className="p-4 flex items-center">
                <div className="w-6 h-6 bg-[#221f3b] rounded-xl flex items-center justify-center">
                  <img
                    className="w-[11px] h-[11px]"
                    alt="Group"
                    src="https://c.animaapp.com/macgsy7nnXUdJ6/img/group-30.png"
                  />
                </div>
  
                <div className="ml-2">
                  <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#f0f0f0] text-sm tracking-[-0.56px]">
                    0x34...3214
                  </div>
  
                  <div className="flex items-center">
                    <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#bdbdbd] text-xs tracking-[-0.48px]">
                      $54,212.52
                    </div>
                    <EyeIcon className="ml-1 w-3 h-3" />
                  </div>
                </div>
              </div>
            </header>
  
            {/* Main content of sidebar */}
            <div className="flex flex-col flex-1 px-4 py-8">
              {/* Main navigation menu */}
              <nav className="mb-8">
                {mainMenuItems.map((item, index) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={`w-full mb-3 h-[31px] justify-start px-2 py-1.5 ${
                      item.active ? "bg-[#201e3d]" : ""
                    } rounded-lg hover:text-white`}
                  >
                    {item.icon}
                    <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-100 text-sm tracking-[-0.56px]">
                      {item.label}
                    </span>
                  </Button>
                ))}
              </nav>
  
              {/* Account section */}
              <div className="mb-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#c4c3d1] text-[13px] tracking-[-0.52px]">
                Account
              </div>
  
              {/* Account menu items */}
              <nav className="mb-8">
                {accountMenuItems.map((item, index) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full mb-3 h-[31px] justify-start px-2 py-1.5 rounded-lg hover:text-white"
                  >
                    {item.icon}
                    <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-100 text-sm tracking-[-0.56px]">
                      {item.label}
                    </span>
                  </Button>
                ))}
              </nav>
  
              {/* Spacer to push bottom items to the bottom */}
              <div className="flex-grow"></div>
  
              {/* Bottom menu items */}
              <div className="mt-auto mb-4">
                {bottomMenuItems.map((item, index) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full mb-3 h-[31px] justify-start px-2 py-1.5 rounded-lg hover:text-white"
                  >
                    {item.icon}
                    <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-100 text-sm tracking-[-0.56px]">
                      {item.label}
                    </span>
                  </Button>
                ))}
              </div>
  
              {/* Dark mode toggle */}
              <div className="w-full h-[31px] rounded-lg overflow-hidden flex items-center justify-between px-2 mb-4">
                <div className="flex items-center">
                  <SunIcon className="w-4 h-4" />
                  <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-100 text-sm tracking-[-0.56px]">
                    Darkmode
                  </span>
                </div>
                <Switch
                  className="data-[state=checked]:bg-[#14ea29]"
                  defaultChecked={true}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };