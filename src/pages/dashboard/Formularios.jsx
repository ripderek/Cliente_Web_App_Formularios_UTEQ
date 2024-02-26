import { IconButton } from "@material-tailwind/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Dialog_Error, Loader } from "@/widgets";
import {
  BarraNavegacion2,
  Navbar_app,
  Configurator,
} from "@/components/layout";
import Head from "next/head";

//rutas que va a tener la barra lateral
import routes from "@/routes";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavColor,
  setFixedNavbar,
  setSidenavType,
  setTransparentNavbar,
} from "@/context";
import React from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import {
  Lista,
  Participantes,
  SeleccionarSecciones,
  ListaPregunta,
} from "@/pages/dashboard/FormulariosC";

//export function BarraNavegacion2
export default function Formularios() {
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
      setSidenavColor(dispatch, cookies.get("sidenavcolor"));
      setSidenavType(dispatch, cookies.get("sidenavtype"));
      setTransparentNavbar(dispatch, cookies.get("transparentnavbar"));
      setFixedNavbar(dispatch, cookies.get("fixednavbar"));
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  const [openSeccion, setOpenSecciones] = useState(true);
  //funcion para abrir los participantes de un test
  const [idTest, setIDtest] = useState(0);
  const [openParticipantes, setOpenParticiapntes] = useState(false);
  const AbrirParticipantes = (idT) => {
    setOpenParticiapntes(true);
    setIDtest(idT);
    setOpenSecciones(false);
    setSeleccionarSeccion(false);
    setOpenEstadistica(false);
  };
  const Regresar = () => {
    setOpenParticiapntes(false);
    setOpenSecciones(true);
    setSeleccionarSeccion(false);
    setOpenEstadistica(false);
  };
  //funcion para abrir el selector de secciones
  const [openSeleccionarSeccion, setSeleccionarSeccion] = useState(false);
  const AbrirSecciones = (idT) => {
    setSeleccionarSeccion(true);
    setOpenSecciones(false);
    setOpenParticiapntes(false);
    setIDtest(idT);
    setOpenEstadistica(false);
  };
  const [openEstadistica, setOpenEstadistica] = useState(false);
  const AbrirEstadisticas = (idT) => {
    setOpenEstadistica(true);
    setSeleccionarSeccion(false);
    setOpenSecciones(false);
    setOpenParticiapntes(false);
    setIDtest(idT);
  };
  //funcion para renderizar los componentes segun un switch
  const renderComponent = () => {
    switch (true) {
      case openSeccion:
        return (
          <Lista
            AbrirParticipantes={AbrirParticipantes}
            AbrirSecciones={AbrirSecciones}
            AbrirEstadisticas={AbrirEstadisticas}
          />
        );
      case openParticipantes:
        return <Participantes idTest_id={idTest} Regresar={Regresar} />;
      case openSeleccionarSeccion:
        return <SeleccionarSecciones idTest_id={idTest} Regresar={Regresar} />;
      //para las estadisticas por preguntas
      case openEstadistica:
        return <ListaPregunta idTest_id={idTest} Regresar={Regresar} />;
      default:
        return null; // Otra opción por defecto si ninguna condición es verdadera
    }
  };
  const cerrar = (valor) => {
    setError(valor);
  };
  const sidenavColors = {
    white: "border-gray-500",
    dark: "border-gray-600",
    green: "border-lime-600",
    orange: "border-orange-600",
    red: "border-red-600",
    pink: "border-pink-600",
  };
  return (
    <div className=" min-h-screen bg-blue-gray-50/50">
      <Head>
        <title>Formularios</title>
      </Head>
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
      <div className="xl:ml-72 ">
        <Navbar_app
          user_name={data_user.r_user_name_ab}
          titulo={"Formularios"}
        />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className={`fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900 shadow-2xl border-x-4 border-y-4  
          ${sidenavColors[sidenavColor]}`}
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <div>
          {/*
            Renderizar el componente del Switch
             */}
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}
Formularios.displayName = "/src/layout/dashboard.jsx";
///src/layout/dashboard.jsx
//export default Home;
