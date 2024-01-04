import { Tooltip } from "@material-tailwind/react";

import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";

export function NavBarForms() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav, sidenavColor } = controller;
  const cookies = new Cookies();
  const [image, setimage] = useState("");
  useEffect(() => {
    setimage(decodeURIComponent(cookies.get("foto_url")));
  }, []);
  return (
    <nav class="bg-green-900 rounded-none dark:bg-gray-900 border-4 border-solid border-orange-800 ">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a class="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/img/Home/Extintor_logo7.png"
            class="h-14"
            alt="Flowbite Logo"
          />
          {/* 
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Xtintor
            </span>
            */}
        </a>
        <div>
          <Tooltip content="Usuario">
            <img
              className="h-14 rounded-none  border-orange-500 border-4 border-solid mt-4"
              src={image}
              alt="User image"
            />
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}

NavBarForms.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default NavBarForms;
