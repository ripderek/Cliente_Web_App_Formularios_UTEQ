import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Dialog_Error, Loader } from "@/widgets";
import {
  BarraNavegacion2,
  Navbar_app,
  Configurator,
} from "@/components/layout";
//rutas que va a tener la barra lateral
import routes from "@/routes";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavColor,
  setFixedNavbar,
} from "@/context";
import React from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { Fragment, useState, useEffect } from "react";

//export function BarraNavegacion2
export default function AllLayouts() {
  const [load, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, sidenavColor } = controller;
  const [data_user, setData_User] = useState([]);
  //hacer una funcion para obtener los datos del usuario logeado y enviarle como prop algunos datos al navbar
  //y para cargar las opciones necesarias en el slidevar
  const cookies = new Cookies();
  //para obtener el dato de la cookie --> cookies.get("id_user")
  useEffect(() => {
    Obtener_Datos_Usuario();
  }, []);
  //funcion para obtener los datos del usuario segun el id de la cookie
  const Obtener_Datos_Usuario = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "users/Datos_Usuario/" +
          cookies.get("id_user"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setData_User(data);
      //console.log(result.data);
      //establecer color verde por defecto xd
      //Esto se deberia cargar desde la base de datos para personlizacion del usuarios

      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  const cerrar = (valor) => {
    setError(valor);
  };
  return (
    <div className=" min-h-screen bg-blue-gray-50/50">
      {error ? (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error Inicio de sesion"
          cerrar={cerrar}
        />
      ) : (
        ""
      )}
      {load ? <Loader /> : ""}
      <BarraNavegacion2
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80 ">
        <Navbar_app user_name={data_user.r_user_name_ab} titulo={"Inicio"} />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className={`fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900 shadow-2xl border-x-4 border-y-4  ${
            sidenavColor === "green" ? "border-green-900" : "border-yellow-900"
          }`}
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <div>Aqui van los propos para abrir formularios hijos a mostrar</div>
      </div>
    </div>
  );
}
Home.displayName = "/src/layout/dashboard.jsx";
///src/layout/dashboard.jsx
//export default Home;
