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
  import { Button } from "../../components/ui/button";
  import { Switch } from "../../components/ui/switch";
  
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
      <div className="bg-[#100e24] flex flex-row justify-center w-full">
        <div className="bg-[#100e24] w-[1440px] h-[1024px]">
          <aside className="relative w-60 h-[1024px] bg-[#17162e]">
            {/* Header with wallet info */}
            <header className="absolute w-60 h-[67px] top-0 left-0 overflow-hidden">
              <img
                className="absolute w-60 h-px top-[66px] left-0"
                alt="Line"
                src="https://c.animaapp.com/macgsy7nnXUdJ6/img/line-1.svg"
              />
  
              <div className="absolute w-[101px] h-[35px] top-4 left-4">
                <div className="absolute w-6 h-6 top-[5px] left-0 bg-[#221f3b] rounded-xl">
                  <img
                    className="absolute w-[11px] h-[11px] top-[7px] left-[7px]"
                    alt="Group"
                    src="https://c.animaapp.com/macgsy7nnXUdJ6/img/group-30.png"
                  />
                </div>
  
                <div className="absolute w-[69px] h-[35px] top-0 left-8">
                  <div className="relative w-[71px] h-[35px]">
                    <div className="absolute top-0 left-0 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#f0f0f0] text-sm tracking-[-0.56px] leading-[normal]">
                      0x34...3214
                    </div>
  
                    <div className="absolute w-[71px] h-4 top-[19px] left-0">
                      <div className="absolute top-0 left-0 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#bdbdbd] text-xs tracking-[-0.48px] leading-[normal]">
                        $54,212.52
                      </div>
  
                      <EyeIcon className="absolute w-3 h-3 top-[3px] left-[57px]" />
                    </div>
                  </div>
                </div>
              </div>
            </header>
  
            {/* Main navigation menu */}
            <nav className="absolute w-52 h-[117px] top-[99px] left-4">
              {mainMenuItems.map((item, index) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`w-52 h-[31px] justify-start px-2 py-1.5 ${
                    item.active ? "bg-[#201e3d]" : ""
                  } rounded-lg`}
                  style={{ top: `${index * 43}px` }}
                >
                  {item.icon}
                  <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-100 text-sm tracking-[-0.56px]">
                    {item.label}
                  </span>
                </Button>
              ))}
            </nav>
  
            {/* Account section */}
            <div className="absolute top-[239px] left-4 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#c4c3d1] text-[13px] tracking-[-0.52px] leading-[normal]">
              Account
            </div>
  
            {/* Account menu items */}
            {accountMenuItems.map((item, index) => (
              <Button
                key={item.label}
                variant="ghost"
                className="absolute w-52 h-[31px] top-[269px] left-4 justify-start px-2 py-1.5 rounded-lg"
                style={{ top: `${269 + index * 43}px` }}
              >
                {item.icon}
                <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-100 text-sm tracking-[-0.56px]">
                  {item.label}
                </span>
              </Button>
            ))}
  
            {/* Bottom menu items */}
            {bottomMenuItems.map((item, index) => (
              <Button
                key={item.label}
                variant="ghost"
                className="absolute w-52 h-[31px] left-4 justify-start px-2 py-1.5 rounded-lg"
                style={{ top: `${891 + index * 43}px` }}
              >
                {item.icon}
                <span className="ml-2 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-100 text-sm tracking-[-0.56px]">
                  {item.label}
                </span>
              </Button>
            ))}
  
            {/* Dark mode toggle */}
            <div className="absolute w-52 h-[31px] top-[977px] left-4 rounded-lg overflow-hidden flex items-center justify-between px-2">
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
          </aside>
        </div>
      </div>
    );
  };
  