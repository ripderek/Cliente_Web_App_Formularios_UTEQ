import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  UserIcon,
  ArrowsPointingOutIcon,
  ArrowLongLeftIcon,
  PencilIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { useState } from "react";
import { EditUser, ChangePassword, Logouth } from "@/pages/UsersControl";
export function Navbar_app({ user_name, titulo }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav, sidenavColor, sidenavType } = controller;
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
  const [openEditPerfil, setOpenEditPerfil] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openTerminarSesecion, setOpenTerminarSecion] = useState(false);
  //${sidenavTypes[sidenavType]}
  return (
    <>
      {openEditPerfil && (
        <EditUser
          cerrarEdicion={() => setOpenEditPerfil(false)}
          realizado={() => setOpenEditPerfil(false)}
        />
      )}
      {openChangePassword && (
        <ChangePassword cerrarEdicion={() => setOpenChangePassword(false)} />
      )}
      {openTerminarSesecion && (
        <Logouth Cancelar={() => setOpenTerminarSecion(false)} />
      )}
      <Navbar
        color={fixedNavbar === false ? "transparent" : "blue"}
        className={`rounded-none transition-all  ${`sticky  z-40  shadow-md border-b-8 shadow-blue-gray-500/5 ${sidenavTypes[sidenavType]} ${sidenavColors[sidenavColor]}`}`}
        fullWidth
        blurred={fixedNavbar}
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="capitalize">
            <Typography
              variant="h4"
              color={sidenavType === "dark" ? "white" : "black"}
            >
              {titulo}
            </Typography>
          </div>
          <div className="flex items-center">
            <div className="mr-auto md:mr-4 md:w-56">
              {/*
            <Input label="Buscar" />
            */}
              {/* Menu para el usuario para salir de la sesion o para modificar sus datos xd */}
              <Menu>
                <MenuHandler>
                  <Chip
                    value={user_name}
                    icon={<UserIcon />}
                    color={sidenavColor}
                    className="max-w-min ml-3 cursor-pointer"
                  />
                </MenuHandler>
                <MenuList className="w-max border-0">
                  <MenuItem
                    className="flex items-center gap-3"
                    onClick={() => setOpenEditPerfil(true)}
                  >
                    <PencilIcon className="h-7 w-7" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-1 font-normal"
                      >
                        {/*
                      <strong>New message</strong> from Laur
                      */}
                        Editar perfil
                      </Typography>
                      {/*
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                    </Typography>
                    */}
                    </div>
                  </MenuItem>
                  <MenuItem
                    className="flex items-center gap-3"
                    onClick={() => setOpenChangePassword(true)}
                  >
                    <EllipsisHorizontalCircleIcon className="h-7 w-7" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-1 font-normal"
                      >
                        Cambiar Contraseña
                      </Typography>
                    </div>
                  </MenuItem>
                  <MenuItem
                    className="flex items-center gap-3"
                    onClick={() => setOpenTerminarSecion(true)}
                  >
                    <ArrowLongLeftIcon className="h-7 w-7" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-1 font-normal"
                      >
                        {/*
                      <strong>New message</strong> from Laur
                      */}
                        Cerrar Sesion
                      </Typography>
                      {/*
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                    </Typography>
                    */}
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            {/*
            <Menu>
              <MenuHandler>
                <IconButton
                  variant="text"
                  color={sidenavType === "dark" ? "white" : "black"}
                >
                  <BellIcon className="h-5 w-5 text-white" />
                </IconButton>
              </MenuHandler>
              
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
 
            </Menu>
*/}
            <IconButton
              variant="text"
              color={"blue-gray"}
              className="grid xl:hidden ml-2"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon
                strokeWidth={3}
                className="h-6 w-6 text-blue-gray-500"
              />
            </IconButton>
          </div>
        </div>
      </Navbar>
    </>
  );
}

Navbar_app.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default Navbar_app;
