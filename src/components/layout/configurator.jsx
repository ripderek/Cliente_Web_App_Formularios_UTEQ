import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Switch,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavColor,
  setSidenavType,
  setFixedNavbar,
} from "@/context";
import axios from "axios";
import Cookies from "universal-cookie";
import Router from "next/router";

function formatNumber(number, decPlaces) {
  decPlaces = Math.pow(10, decPlaces);

  const abbrev = ["K", "M", "B", "T"];

  for (let i = abbrev.length - 1; i >= 0; i--) {
    var size = Math.pow(10, (i + 1) * 3);

    if (size <= number) {
      number = Math.round((number * decPlaces) / size) / decPlaces;

      if (number == 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }

      number += abbrev[i];

      break;
    }
  }

  return number;
}
import { useState, useEffect } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

export function Configurator() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar } =
    controller;
  const [stars, setStars] = useState(0);

  const sidenavColors = {
    white: "from-gray-100 to-gray-100 border-gray-200",
    dark: "from-black to-black border-gray-200",
    green: "from-lime-600 to-lime-600",
    orange: "from-orange-400 to-orange-600",
    red: "from-red-400 to-red-600",
    pink: "from-pink-400 to-pink-600",
  };
  //funcion para guardar en la BD la configuracion de los colores skere modo diablo
  const [load, setLoader] = useState(false);
  const cookies = new Cookies();
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const cerrar1 = (valor) => {
    setError(valor);
  };
  const GuardarConfiguracion = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");

    try {
      setLoader(true);
      //Actualizar la contrasena

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "users/sp_actualizar_interfaz_usuario",
        {
          p_id_usuario: cookies.get("id_user"),
          p_sidenavcolor: sidenavColor,
          p_sidenavtype: sidenavType,
        },
        {
          withCredentials: true,
        }
      );
      cookies.remove("sidenavcolor");
      cookies.remove("sidenavtype");
      cookies.set("sidenavcolor", sidenavColor, { path: "/" }); //enviar cokiee y almacenarla
      cookies.set("sidenavtype", sidenavType, { path: "/" });
      setLoader(false);
      const nuevaRuta = "/dashboard/Home"; //
      //Router.push(nuevaRuta);
      //agregar_seccion();
      //aqui refrescar la paguina y redireccionar hacia el inicio de sesion
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.message);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  return (
    <aside
      className={`fixed top-0 right-0 z-50 h-screen w-96 overflow-y-scroll bg-white px-2.5 shadow-lg transition-transform duration-300 ${
        openConfigurator ? "translate-x-0" : "translate-x-96"
      }`}
    >
      {load && <Loader />}
      {error && (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      )}
      <div className="flex items-start justify-between px-6 pt-8 pb-6 ">
        <div>
          <Typography variant="h5" color="blue-gray">
            Configuracion de panel
          </Typography>
          <Typography className="font-normal text-blue-gray-600">
            Vea las opciones de panel
          </Typography>
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setOpenConfigurator(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="py-4 px-6">
        <div className="mb-12">
          <Typography variant="h6" color="blue-gray">
            Color de Selector
          </Typography>
          <div className="mt-3 flex items-center gap-2">
            {Object.keys(sidenavColors).map((color) => (
              <span
                key={color}
                className={`h-6 w-6 cursor-pointer rounded-full border bg-gradient-to-br transition-transform hover:scale-105 ${
                  sidenavColors[color]
                } ${
                  sidenavColor === color ? "border-black" : "border-transparent"
                }`}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </div>
        </div>
        <div className="mb-12">
          <Typography variant="h6" color="blue-gray">
            Tipo de panel
          </Typography>
          <Typography variant="small" color="gray">
            Seleccione tres diferentes tipos de panel
          </Typography>
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant={sidenavType === "dark" ? "gradient" : "outlined"}
              color="green"
              onClick={() => setSidenavType(dispatch, "dark")}
            >
              Oscuro
            </Button>
            {/* 
            <Button
              variant={sidenavType === "transparent" ? "gradient" : "outlined"}
              onClick={() => setSidenavType(dispatch, "transparent")}
            >
              Transparente
            </Button>
            */}
            <Button
              variant={sidenavType === "white" ? "gradient" : "outlined"}
              onClick={() => setSidenavType(dispatch, "white")}
              color="light-green"
              //className="mt-4"
            >
              Blanco
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <hr />
          {/*
          <div className="flex items-center justify-between py-5">
            <Typography variant="h6" color="blue-gray">
              Barra de navegación fija
            </Typography>
            <Switch
              id="navbar-fixed"
              value={fixedNavbar}
              onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
            />
          </div>
 */}
          <hr />
          <div className="my-8 flex flex-col gap-4">
            <Button
              variant="gradient"
              fullWidth
              color="green"
              onClick={() => GuardarConfiguracion()}
            >
              Guardar configuracion
            </Button>
          </div>
        </div>

        <div className="text-center">
          {/*
          <Typography variant="h6" color="blue-gray">
            Extintor Team
          </Typography>
           */}
          <div className="flex justify-center gap-2">
            <div className="p-2">
              <img
                className=" w-auto rounded-full"
                src="/img/Home/Extintor_logo.png"
                alt="User image"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

Configurator.displayName = "/src/widgets/layout/configurator.jsx";
//Navbar_app.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default Configurator;
