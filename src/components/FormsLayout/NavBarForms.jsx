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
  //const [image, setimage] = useState("");
  const [nombres, setNombre] = useState("");
  const [nombresS, setNombreS] = useState("");

  //nombres_completos
  useEffect(() => {
    //setimage(decodeURIComponent(cookies.get("foto_url")));
    setNombre(decodeURIComponent(cookies.get("Nombres")));
    setNombreS(decodeURIComponent(cookies.get("Nombres")).substring(0, 15));
  }, []);
  return (
    <nav class="bg-green-900 border-orange-600 border-b-8  rounded-none">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <a class="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/img/Home/uteq_logo3.png"
            class="h-12"
            alt="Flowbite Logo"
          />
          {/* 
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Xtintor
            </span>
            */}
        </a>

        {/*
        <div className="md:invisible visible">
          <Tooltip content={nombresS}>
            <img
              className="h-14 rounded-none  border-orange-500 border-4 border-solid mt-4"
              //src={image}
              alt="User image"
            />
          </Tooltip>
        </div>
        */}

        {/*
        <div className="md:visible invisible h-0 md:h-auto">
          <div className="h-auto bg-white flex mt-1 cursor-pointer text-center rounded-none mx-auto w-full border-4 border-solid border-orange-500">
            <div className="flex items-center">
              <Tooltip content={nombres}>
                <img
                  className="h-14 rounded-none border-orange-500 border-r-4 border-solid"
                  //src={image}
                  alt="User image"
                />
              </Tooltip>
              <div className="ml-2 font-bold text-blue-gray-600 p-2">
                {nombresS}..
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </nav>
  );
}

NavBarForms.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default NavBarForms;
