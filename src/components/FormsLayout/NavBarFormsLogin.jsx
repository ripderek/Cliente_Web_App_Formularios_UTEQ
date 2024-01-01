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
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

export function NavBarFormsLogin({ user_name, titulo, viewLogin, loginG }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav, sidenavColor } = controller;

  return (
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a class="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/img/Home/Extintor_logo.png"
            class="h-8"
            alt="Flowbite Logo"
          />
          {/* 
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Xtintor
            </span>
            */}
        </a>
        {viewLogin ? (
          <div>
            <div
              className="h-auto bg-blue-gray-100  flex items-center justify-center mt-4 cursor-pointer text-center rounded-lg mx-auto w-full"
              onClick={loginG}
            >
              <div className="p-2">
                <img
                  className="h-7 w-7 rounded-full"
                  src="/img/Home/Google.png"
                  alt="User image"
                />
              </div>
              <div className="ml-2 font-bold text-blue-gray-600 p-2">
                Continuar con Google
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
}

NavBarFormsLogin.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default NavBarFormsLogin;
