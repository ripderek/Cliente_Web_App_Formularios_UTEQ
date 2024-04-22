import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Dialog_Error, Loader } from "@/widgets";
import Head from "next/head";
const HEAD_SECCIONES_CREADAS = ["Titulo", "Fecha"];
const HEAD_SECCIONES_INVITADO = ["Titulo", "Fecha"];
const HEAD_FORMULARIOS_ERRONEOS = ["Titulo"];
const HEAD_FORMULARIOS_MORE_PARTICIPANTES = ["Titulo", "Cantidad Partcipantes"];

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
  setSidenavType,
  setTransparentNavbar,
} from "@/context";
import React from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import { Circular } from "@/pages/Graficos";
//export function BarraNavegacion2
export default function Home() {
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
    ObtenerEstadistca();
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
      //cargar de las cookies la configuracion de los colores xd
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
  const [NombreUser, SetNombreUser] = useState("");
  const [SecionesCreadas, setSeccionesCreadas] = useState([]);
  const [SeccionesInvitado, setSeccionesInvitado] = useState([]);
  const [SeccionesEstadistica, setSeccionesEstadistica] = useState([]);
  const [Formularios_Erroneos, setFormularios_Erroneos] = useState([]);
  const [Formularios_mas_participantes, setFormularios_mas_participantes] =
    useState([]);
  const ObtenerEstadistca = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "users/estadistica_paguina_home/" +
          cookies.get("id_user"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetNombreUser(data.resultado.NombreUser);
      console.log(data);
      setSeccionesCreadas(data.resultado.SeccionesAdmin);
      setSeccionesInvitado(data.resultado.SeccionesInvitado);
      setSeccionesEstadistica(data.resultado.SeccionesEstadistica[0]);
      setFormularios_Erroneos(data.resultado.Formularios_Erroneos);
      setFormularios_mas_participantes(
        data.resultado.Formularios_mas_participantes
      );
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
  //colores
  const sidenavColors = {
    white: "border-gray-500",
    dark: "border-gray-600",
    green: "border-lime-600",
    orange: "border-orange-600",
    red: "border-red-600",
    pink: "border-pink-600",
  };
  const COLORS = ["#0088FE", "#00C49F"]; //COLORES PARA EL GRAFICO CIRUCLAR SKERE MODO
  const data = [
    {
      name: "Secciones Erróneas",
      value: SeccionesEstadistica.r_secciones_erroneas || 0,
    },
    {
      name: "Secciones no Erróneas",
      value: SeccionesEstadistica.r_secciones_no_erroneas || 0,
    },
  ];
  return (
    <div className=" min-h-screen bg-white">
      <Head>
        <title>Principal</title>
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
        <Navbar_app user_name={data_user.r_user_name_ab} titulo={"Inicio"} />
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
          <Typography variant="h4" color="blue-gray">
            Bienvenido
          </Typography>

          <Typography variant="h1" className="ml-4">
            {NombreUser}
          </Typography>
        </div>
        {/* LAS PRIMERA DOS COLUMNAS EN FORMA DE TABLAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
          <div
            key={1}
            className={`shadow-sm rounded-none  hover:border-4 ${sidenavColors[sidenavColor]} `}
          >
            <Card className="h-full w-full ">
              <Typography variant="h4" color="blue-gray">
                Ultimas secciones
              </Typography>
              {!SecionesCreadas ? (
                <Typography variant="h5" color="gray" className="mx-auto mt-3">
                  No tiene secciones creadas
                </Typography>
              ) : (
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {HEAD_SECCIONES_CREADAS.map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SecionesCreadas.map(
                      (
                        { r_seccion_titulo, r_descripcion, r_fecha_add },
                        index
                      ) => {
                        const isLast = index === SecionesCreadas.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={r_seccion_titulo}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_seccion_titulo}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_fecha_add}
                              </Typography>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
          <div
            key={2}
            className={`shadow-sm rounded-none  hover:border-4 ${sidenavColors[sidenavColor]} `}
          >
            <Card className="h-full w-full ">
              <Typography variant="h4" color="blue-gray">
                Secciones foraneas
              </Typography>
              {!SeccionesInvitado ? (
                <Typography variant="h5" color="gray" className="mx-auto mt-3">
                  No tiene secciones foraneas
                </Typography>
              ) : (
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {HEAD_SECCIONES_INVITADO.map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SeccionesInvitado.map(
                      (
                        { r_seccion_titulo, r_descripcion, r_fecha_add },
                        index
                      ) => {
                        const isLast = index === SeccionesInvitado.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={r_seccion_titulo}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_seccion_titulo}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_fecha_add}
                              </Typography>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </div>
        {/* GRAFICO ESTADISCTO SOBRE LAS SECCIONES QUE TIENEN Y NO TIENEN ERROR  */}
        {!SeccionesEstadistica ? (
          ""
        ) : (
          <div className="grid grid-cols-1 gap-3 p-5">
            <Typography variant="h4" color="blue-gray">
              Estadistica Secciones
            </Typography>
            <div
              key={1}
              className={`bg-white shadow-sm rounded-none mx-auto  hover:border-4 ${sidenavColors[sidenavColor]} `}
            >
              <div className="mx-auto">
                <Circular datos={SeccionesEstadistica} className="mx-auto" />
              </div>
            </div>
          </div>
        )}
        {/* ESTADISTICAS SOBRE LOS FORMULARIOS  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
          <div
            key={1}
            className={` shadow-sm rounded-none  hover:border-4 ${sidenavColors[sidenavColor]} `}
          >
            <Card className="h-full w-full ">
              <Typography variant="h4" color="blue-gray">
                Formularios con errores
              </Typography>
              {!Formularios_Erroneos ? (
                <Typography variant="h5" color="gray" className="mx-auto mt-3">
                  No tiene formularios erroneos
                </Typography>
              ) : (
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {HEAD_FORMULARIOS_ERRONEOS.map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Formularios_Erroneos.map(
                      ({ r_id_formulario, r_titulo_formulario }, index) => {
                        const isLast =
                          index === Formularios_Erroneos.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={r_id_formulario}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_titulo_formulario}
                              </Typography>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
          <div
            key={2}
            className={` shadow-sm rounded-none  hover:border-4 ${sidenavColors[sidenavColor]} `}
          >
            <Card className="h-full w-full ">
              <Typography variant="h4" color="blue-gray">
                Formularios con más participantes
              </Typography>
              {!Formularios_mas_participantes ? (
                <Typography variant="h5" color="gray" className="mx-auto mt-3">
                  No tiene formularios con participantes
                </Typography>
              ) : (
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {HEAD_FORMULARIOS_MORE_PARTICIPANTES.map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Formularios_mas_participantes.map(
                      (
                        { r_tituloTest, r_id_test, r_numero_participantes },
                        index
                      ) => {
                        const isLast =
                          index === Formularios_mas_participantes.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={r_id_test}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_tituloTest}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_numero_participantes}
                              </Typography>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
Home.displayName = "/src/layout/dashboard.jsx";
///src/layout/dashboard.jsx
//export default Home;
