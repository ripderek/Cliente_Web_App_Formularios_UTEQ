import PropTypes from "prop-types";
import Link from "next/link";
import { Dialog_Error, Loader, Notification } from "@/widgets";

//imports del sidenav del otro proyecto
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tooltip,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

//Hacer una consulta a la BD para cargar las configuraciones de la interfaz

export function BarraNavegacion2({ routes, brandImg, brandName }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const isActive = (path) => useRouter().pathname === path;
  const sidenavTypes = {
    dark: "bg-green-900 ",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  const sidenavColors = {
    white: "border-gray-500",
    dark: "border-gray-600",
    green: "border-lime-600",
    orange: "border-orange-600",
    red: "border-red-600",
    pink: "border-pink-600",
  };
  const [load, setLoader] = useState(false);

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50   w-72 rounded-none transition-transform duration-300 xl:translate-x-0 border-l-8 border-blue-gray-100 overflow-y-scroll ${
        sidenavColors[sidenavColor]
      }`}
    >
      {load ? <Loader /> : ""}
      <div>
        <aside className="">
          <div>
            <Card
              className={`w-auto shadow-none  ${sidenavTypes[sidenavType]}`}
            >
              <CardHeader
                floated={false}
                className={`h-auto w-44 mx-auto text-center shadow-none${sidenavTypes[sidenavType]}`}
              >
                <img
                  src="/img/Home/UTEQ.png"
                  alt="Empresa logo"
                  className="w-auto"
                />
              </CardHeader>

              <CardBody className="text-center">
                <Typography
                  variant="h4"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                >
                  Formularios APP
                </Typography>
              </CardBody>
            </Card>
            <IconButton
              variant="text"
              color="white"
              size="sm"
              ripple={false}
              className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
              onClick={() => setOpenSidenav(dispatch, false)}
            >
              <XMarkIcon
                strokeWidth={2.5}
                className="h-6 w-6 font-bold"
                color={sidenavColor}
              />
            </IconButton>
          </div>
          <div className=" ">
            {routes.map(({ layout, title, pages }, key) => (
              <ul key={key} className=" flex flex-col gap-1 ">
                {title && (
                  <li className="mx-3.5">
                    <Typography
                      variant="small"
                      color={sidenavType === "dark" ? "white" : "blue-gray"}
                      className="font-black uppercase opacity-75 "
                    >
                      {title}
                    </Typography>
                  </li>
                )}
                {pages.map(({ icon, name, path }) => (
                  <li key={name}>
                    <Link href={`/${layout}${path}`} passHref>
                      <Button
                        as="a"
                        variant={
                          isActive(`/${layout}${path}`) ? "gradient" : "text"
                        }
                        color={
                          isActive(`/${layout}${path}`)
                            ? sidenavColor
                            : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"
                        }
                        className="flex items-center gap-2 rounded-none w-full capitalize"
                        fullWidth
                        onClick={() =>
                          isActive == true ? setLoader(true) : ""
                        }
                      >
                        {icon}
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {name}
                        </Typography>
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
            <Card
              className={`w-auto shadow-none mb-0 ${sidenavTypes[sidenavType]}`}
            >
              <CardBody className="text-center">
                <Typography
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-medium"
                >
                  Extintor Team
                </Typography>
                <Typography
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-medium text-sm"
                >
                  V.2.0.1
                </Typography>
              </CardBody>
            </Card>
          </div>
        </aside>
      </div>
    </aside>
  );
}

BarraNavegacion2.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

BarraNavegacion2.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

BarraNavegacion2.displayName = "/src/components/layout/BarraNavegacion2.jsx";
export default BarraNavegacion2;
