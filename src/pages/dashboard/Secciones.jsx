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
import { Lista } from "@/pages/dashboard/OpcionesSecciones";
import { ListaNiveles } from "@/pages/dashboard/Niveles";
import {
  MEMRZAR,
  MEMRZAR_resp,
  SELCIMG,
  SELCIMG_resp,
  SELCCLA,
  SELCCLA_resp,
} from "@/pages/dashboard/Plantillas";
import {
  ListaPreguntas,
  PlantillasPreguntas,
} from "@/pages/dashboard/Preguntas";
//export function BarraNavegacion2
export default function Secciones() {
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
      setSidenavColor(dispatch, "green");
      setFixedNavbar(dispatch, true);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  //funcion para cambiar de pestanas entre lista de secciones y lista de niveles de una seccion
  const [openNiveles, setOpenNiveles] = useState(false);
  const [IDSeccion, setIdSeccion] = useState("");
  const [tituloSeccion, setTituloSeccion] = useState("");
  const AbrirNiveles = (value, id_seccion, titulo) => {
    setOpenNiveles(value);
    setIdSeccion(id_seccion);
    setTituloSeccion(titulo);
    setOpenSecciones(false);
    setOpenPreguntas(false);
    setOpenPlantilla(false);
    setMEMRZAR(false);
    setOpenEditMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para abrir secciones
  const [openSeccion, setOpenSecciones] = useState(true);
  const AbrirSecciones = (value) => {
    setOpenSecciones(value);
    setOpenNiveles(false);
    setOpenPreguntas(false);
    setOpenPlantilla(false);
    setMEMRZAR(false);
    setOpenEditMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para abrir lista de preguntas
  const [IDNivel, setIDNivel] = useState("");
  const [openPreguntas, setOpenPreguntas] = useState(false);
  const [nombre_nivel, setNombreNivel] = useState("");
  const AbrirPreguntas = (value, id_nv, nivel) => {
    setIDNivel(id_nv);
    setOpenPreguntas(value);
    setNombreNivel(nivel);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setOpenPlantilla(false);
    setMEMRZAR(false);
    setOpenEditMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para abrir el menu de seleccionar plantilla para crear una pregunta dependiendo del tipo maestro de pregunta
  //necesito el id del tipo de pregunta, el titulo y el id del nivel.
  const [idTipoPregunta, setIdTipoPregunta] = useState("");
  const [tituloTipo, setTituloTipo] = useState("");
  const [openPlantilla, setOpenPlantilla] = useState(false);
  const AbrirPlantilla = (value, tip, tit, idn) => {
    setOpenPlantilla(value);
    setIdTipoPregunta(tip);
    setTituloTipo(tit);
    setIDNivel(idn);
    setOpenPreguntas(false);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setMEMRZAR(false);
    setOpenEditMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para abrir la creacion de una pregunta xd
  //para la plantilla MEMRZAR --> Memorizar opcion uninca
  const [openMEMRZAR, setMEMRZAR] = useState(false);
  const [IDTIPOPRE, setIDTIPO] = useState(0);
  const [r_icono, setr_icono] = useState("");
  const AbrirMEMRZAR = (r_codigo, iconoP) => {
    setMEMRZAR(true);
    setIDTIPO(r_codigo);
    setOpenPreguntas(false);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setOpenPlantilla(false);
    setr_icono(iconoP);
    setOpenEditMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para crear o editar las imagenes respuestas de MEMRZAR
  const [idPregunta, setIDPregunta] = useState(0);
  const [openEditMEMRZAR, setOpenEditMEMRZAR] = useState(false);
  const [buscarEditMEMRZAR, setbuscarEditMEMRZAR] = useState(true);
  const AbrirEditarMEMRZAR = (id_pr, busqueda) => {
    setIDPregunta(id_pr);
    setbuscarEditMEMRZAR(busqueda);
    setOpenEditMEMRZAR(true);
    setOpenPreguntas(false);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setOpenPlantilla(false);
    setMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para abrir el creador de preguntas de tipo SELCIMG
  const [openSELCIMG, setSELCIMG] = useState(false);
  const AbrirSELCIMG = (r_codigo, iconoP) => {
    setMEMRZAR(false);
    setIDTIPO(r_codigo);
    setOpenPreguntas(false);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setOpenPlantilla(false);
    setr_icono(iconoP);
    setOpenEditMEMRZAR(false);
    setSELCIMG(true);
    setOpenEditSELCIMG(false);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para abrir el editor de tipo SELCIMG
  const [openEditSELCIMG, setOpenEditSELCIMG] = useState(false);
  const [buscarEditSELCIMG, setbuscarEditSELCIMG] = useState(true);
  const AbrirEditarSELCIMG = (id_pr, busqueda) => {
    setIDPregunta(id_pr);
    setbuscarEditSELCIMG(busqueda);
    setOpenEditMEMRZAR(false);
    setOpenPreguntas(false);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setOpenPlantilla(false);
    setMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(true);
    setSELCCLA(false);
    setOpenEditSELCCLA(false);
  };
  //AbrirSELCCLA
  //funcion para abrir el creador de preguntas de tipo SELCIMG
  const [openSELCCLA, setSELCCLA] = useState(false);
  const AbrirSELCCLA = (r_codigo, iconoP) => {
    setMEMRZAR(false);
    setIDTIPO(r_codigo);
    setOpenPreguntas(false);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setOpenPlantilla(false);
    setr_icono(iconoP);
    setOpenEditMEMRZAR(false);
    setSELCCLA(true);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setOpenEditSELCCLA(false);
  };
  //funcion para abrir el editor de tipo SELCIMG
  const [openEditSELCCLA, setOpenEditSELCCLA] = useState(false);
  const [buscarEditSELCCLA, setbuscarEditSELCCLA] = useState(true);
  const AbrirEditarSELCCLA = (id_pr, busqueda) => {
    setIDPregunta(id_pr);
    setbuscarEditSELCCLA(busqueda);
    setOpenEditMEMRZAR(false);
    setOpenPreguntas(false);
    setOpenNiveles(false);
    setOpenSecciones(false);
    setOpenPlantilla(false);
    setMEMRZAR(false);
    setSELCIMG(false);
    setOpenEditSELCIMG(false);
    setOpenEditSELCCLA(true);
    setSELCCLA(false);
  };
  //funcion para renderizar los componentes segun un switch
  const renderComponent = () => {
    switch (true) {
      case openSeccion:
        return <Lista AbrirNiveles={AbrirNiveles} />;
      case openNiveles:
        return (
          <ListaNiveles
            id_seccion={IDSeccion}
            AbrirSecciones={AbrirSecciones}
            Titulo={tituloSeccion}
            AbrirPreguntas={AbrirPreguntas}
          />
        );
      case openPreguntas:
        return (
          <ListaPreguntas
            id_nivel={IDNivel}
            nivel={nombre_nivel}
            seccion={tituloSeccion}
            id_seccion={IDSeccion}
            AbrirNiveles={AbrirNiveles}
            AbrirPlantilla={AbrirPlantilla}
            AbrirEditarMEMRZAR={AbrirEditarMEMRZAR}
            AbrirEditarSELCIMG={AbrirEditarSELCIMG}
            AbrirEditarSELCCLA={AbrirEditarSELCCLA}
          />
        );
      case openPlantilla:
        return (
          <PlantillasPreguntas
            id_tipo={idTipoPregunta}
            titulo_tipo={tituloTipo}
            id_niv={IDNivel}
            AbrirMEMRZAR={AbrirMEMRZAR}
            AbrirSELCIMG={AbrirSELCIMG}
            AbrirSELCCLA={AbrirSELCCLA}
          />
        );
      case openMEMRZAR:
        return (
          <MEMRZAR
            tipo_preg={IDTIPOPRE}
            id_nivel={IDNivel}
            icono={r_icono}
            AbrirEditarMEMRZAR={AbrirEditarMEMRZAR}
          />
        );
      case openEditMEMRZAR:
        return (
          <MEMRZAR_resp
            id_pregunta={idPregunta}
            buscar={buscarEditMEMRZAR}
            id_nivel={IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={IDNivel}
            nombrenivel={nombre_nivel}
          />
        );
      case openSELCIMG:
        return (
          <SELCIMG
            tipo_preg={IDTIPOPRE}
            id_nivel={IDNivel}
            icono={r_icono}
            AbrirEditarSELCIMG={AbrirEditarSELCIMG}
          />
        );
      case openEditSELCIMG:
        return (
          <SELCIMG_resp
            id_pregunta={idPregunta}
            buscar={buscarEditSELCIMG}
            id_nivel={IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={IDNivel}
            nombrenivel={nombre_nivel}
          />
        );
      //SELCCLA
      case openSELCCLA:
        return (
          <SELCCLA
            tipo_preg={IDTIPOPRE}
            id_nivel={IDNivel}
            icono={r_icono}
            AbrirEditarSELCCLA={AbrirEditarSELCCLA}
          />
        );
      case openEditSELCCLA:
        return (
          <SELCCLA_resp
            id_pregunta={idPregunta}
            buscar={buscarEditSELCCLA}
            id_nivel={IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={IDNivel}
            nombrenivel={nombre_nivel}
          />
        );
      default:
        return null; // Otra opción por defecto si ninguna condición es verdadera
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
        <Navbar_app user_name={data_user.r_user_name_ab} titulo={"Secciones"} />
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
Secciones.displayName = "/src/layout/dashboard.jsx";
///src/layout/dashboard.jsx
//export default Home;
