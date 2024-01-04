import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
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

export function BarraNavegacion2({ routes, brandImg, brandName }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  // Define la lógica para determinar si un enlace está activo
  const isActive = (path) => useRouter().pathname === path;
  const sidenavTypes = {
    dark: "bg-green-500",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 overflow-y-scroll`}
    >
      <div className={`relative `}>
        <Card
          className={`w-auto shadow-none mb-0 ${
            sidenavType === "dark" ? "bg-green-500" : "bg-white"
          }`}
        >
          <CardHeader
            floated={false}
            className={`h-auto w-44 mx-auto text-center shadow-none${
              sidenavType === "dark" ? "bg-green-500" : "bg-white"
            }`}
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
              className="mb-2"
            >
              Formularios APP
            </Typography>
            <Typography
              color={sidenavType === "dark" ? "white" : "blue-gray"}
              className="font-medium"
            >
              Extintor Team
            </Typography>
          </CardBody>
          {/* 
          <CardFooter className="flex justify-center gap-7 pt-2">
           
            <Tooltip content="Like">
              <Typography
                as="a"
                href="#facebook"
                variant="lead"
                color="blue"
                textGradient
              >
                <i className="fab fa-facebook" />
              </Typography>
            </Tooltip>
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="#twitter"
                variant="lead"
                color="light-blue"
                textGradient
              >
                <i className="fab fa-twitter" />
              </Typography>
            </Tooltip>
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="#instagram"
                variant="lead"
                color="purple"
                textGradient
              >
                <i className="fab fa-instagram" />
              </Typography>
            </Tooltip>
           
          </CardFooter>
           */}
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
      <div className="m-4 ">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1 ">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
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
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
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
