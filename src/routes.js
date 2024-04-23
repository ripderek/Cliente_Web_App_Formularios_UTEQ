//Este es un nuevo archivo que no se habia usado en el proyecto anterior sirve como un rotueador parecedio a nodejs

import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  AdjustmentsHorizontalIcon,
  RectangleStackIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
//Importa todos los componentes que tiene la carpta MenuLateral mediante el index.js
//import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";

//aqui es para particionar la barra en otra seccion
//import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Principal",
        path: "/Home",
        //element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Secciones",
        path: "/Secciones",
        //element: <Tables />,
      },
      {
        icon: <AdjustmentsHorizontalIcon {...icon} />,
        name: "Formularios",
        path: "/Formularios",
        //element: <Profile />,
      },

      {
        icon: <ClipboardDocumentIcon {...icon} />,
        name: "Reportes",
        path: "/Reportes",
        //element: <Notifications />,
      },
    ],
  },
  /*
  {
    title: "",
    layout: "superuser",
    pages: [
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Usuarios",
        path: "/notifications",
        //element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Formularios",
        path: "/notifications",
        //element: <Notifications />,
      },
    ],
  },
  */
];

export default routes;
