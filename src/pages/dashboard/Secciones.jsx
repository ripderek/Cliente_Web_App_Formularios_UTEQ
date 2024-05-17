import { IconButton } from "@material-tailwind/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Dialog_Error, Loader } from "@/widgets";
import {
  BarraNavegacion2,
  Navbar_app,
  Configurator,
} from "@/components/layout";
//rutas que va a tener la barra lateral
import Head from "next/head";

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
import { Fragment, useState, useEffect } from "react";
import { Lista } from "@/pages/dashboard/OpcionesSecciones";
import { ListaNiveles } from "@/pages/dashboard/Niveles";
//Importar las interfaces de crear por plantillas
import {
  MEMRZAR,
  MEMRZAR_resp,
  SELCIMG,
  SELCIMG_resp,
  SELCCLA,
  SELCCLA_resp,
  LOCIMG,
  MULTIMG,
  INGRNUM,
  INGRNUM_resp,
  OPCLAVA,
  OPCLAVA_resp,
  OPCLAV2,
  OPCLAV2_resp,
  MULIMGT,
  MULIMGT_resp,
  SELCCMA,
  SELCCMA_resp,
  ENSEMUL,
  ENSEMUL_resp,
  ENINMAN,
  ENINMAN_resp,
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
  //funcion para cambiar de pestanas entre lista de secciones y lista de niveles de una seccion

  const [tabs, setTabs] = useState({
    openSeccion: true,
    openNiveles: false,
    openPreguntas: false,
    openPlantilla: false,
    openMEMRZAR: false,
    openEditMEMRZAR: false,
    openSELCIMG: false,
    openEditSELCIMG: false,
    openSELCCLA: false,
    openEditSELCCLA: false,
    openLOCIMG: false,
    openEditLOCIMG: false,
    openMULTIMG: false,
    openEditMULTIMG: false,
    openINGRNUM: false,
    openEditINGRNUM: false,
    openOPCLAVA: false,
    openEditOPCLAVA: false,
    openOPCLAV2: false,
    openEditOPCLAV2: false,
    openMULIMGT: false,
    openEditMULIMGT: false,
    openSELCCMA: false,
    openEditSELCCMA: false,
    openENSEMUL: false,
    openEditENSEMUL: false,
    openENINMAN: false,
    openEditENINMAN: false,
  });

  const [tabInfo, setTabInfo] = useState({
    IDSeccion: "",
    tituloSeccion: "",
    IDNivel: "",
    nombre_nivel: "",
    idTipoPregunta: "",
    tituloTipo: "",
    idPregunta: 0,
    IDTIPOPRE: 0,
    r_icono: "",
    buscarEditMEMRZAR: true,
    buscarEditSELCIMG: true,
    buscarEditSELCCLA: true,
    buscarEditLOCIMG: true,
    buscarEditMULTIMG: true,
    buscarEditINGRNUM: true,
    buscarEditOPCLAVA: true,
    buscarEditOPCLAV2: true,
    buscarEditMULIMGT: true,
    buscarEditSELCCMA: true,
    buscarEditENSEMUL: true,
    buscarEditENINMAN: true,
    //OPCLAV2
  });

  // Función para cambiar entre pestañas
  const cambiarPestañas = (nuevaPestaña) => {
    setTabs((prevTabs) => ({
      ...Object.fromEntries(
        Object.entries(prevTabs).map(([key]) => [key, false])
      ),
      [nuevaPestaña]: true,
    }));
  };

  // Función para abrir pestaña de niveles
  const AbrirNiveles = (IDSeccion, tituloSeccion) => {
    setTabInfo({
      ...tabInfo,
      IDSeccion,
      tituloSeccion,
    });
    cambiarPestañas("openNiveles");
  };

  // Función para abrir pestaña de secciones
  const AbrirSecciones = () => {
    cambiarPestañas("openSeccion");
  };

  // Función para abrir pestaña de preguntas
  const AbrirPreguntas = (IDNivel, nombre_nivel) => {
    setTabInfo({
      ...tabInfo,
      IDNivel,
      nombre_nivel,
    });
    cambiarPestañas("openPreguntas");
  };

  // Función para abrir pestaña de plantilla
  const AbrirPlantilla = (idTipoPregunta, tituloTipo, IDNivel) => {
    setTabInfo({
      ...tabInfo,
      idTipoPregunta,
      tituloTipo,
      IDNivel,
    });
    cambiarPestañas("openPlantilla");
  };

  // Función para abrir pestaña de las Preguntas
  //Reemplazar AbrirMEMRZAR todos los Abrir por esta funcion
  const AbrirCreador = (pestaña, IDTIPOPRE, r_icono) => {
    setTabInfo({
      ...tabInfo,
      IDTIPOPRE,
      r_icono,
    });
    cambiarPestañas(`open${pestaña}`);
  };

  // Función para abrir pestaña de editar MEMRZAR, SELCIMG, SELCCLA
  //AbrirEditarMEMRZAR
  //AbrirEditarSELCIMG
  //AbrirEditarSELCCLA
  //en pestana solo se envia MEMRZAR por ejemplo
  const AbrirEditor = (pestaña, idPregunta, busqueda) => {
    setTabInfo({
      ...tabInfo,
      idPregunta,
      [`buscarEdit${pestaña}`]: busqueda,
    });
    cambiarPestañas(`openEdit${pestaña}`);
  };
  //ahora hay que enviar estos parametros
  //SELCCLA
  //MEMRZAR
  //SELCCLA

  //funcion para renderizar los componentes segun un switch
  const renderComponent = () => {
    switch (true) {
      case tabs.openSeccion:
        return <Lista AbrirNiveles={AbrirNiveles} />;
      case tabs.openNiveles:
        return (
          <ListaNiveles
            id_seccion={tabInfo.IDSeccion}
            AbrirSecciones={AbrirSecciones}
            Titulo={tabInfo.tituloSeccion}
            AbrirPreguntas={AbrirPreguntas}
          />
        );
      case tabs.openPreguntas:
        return (
          <ListaPreguntas
            id_nivel={tabInfo.IDNivel}
            nivel={tabInfo.nombre_nivel}
            seccion={tabInfo.tituloSeccion}
            id_seccion={tabInfo.IDSeccion}
            AbrirNiveles={AbrirNiveles}
            AbrirPlantilla={AbrirPlantilla}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openPlantilla:
        return (
          <PlantillasPreguntas
            id_tipo={tabInfo.idTipoPregunta}
            titulo_tipo={tabInfo.tituloTipo}
            id_niv={tabInfo.IDNivel}
            AbrirCreador={AbrirCreador}
            cambiarPestañas={cambiarPestañas}
          />
        );
      case tabs.openMEMRZAR:
        return (
          <MEMRZAR
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
            cambiarPestañas={cambiarPestañas}
          />
        );
      case tabs.openEditMEMRZAR:
        return (
          <MEMRZAR_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditMEMRZAR}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
          />
        );
      case tabs.openSELCIMG:
        return (
          <SELCIMG
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openEditSELCIMG:
        return (
          <SELCIMG_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditSELCIMG}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
          />
        );
      //SELCCLA
      case tabs.openSELCCLA:
        return (
          <SELCCLA
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openEditSELCCLA:
        return (
          <SELCCLA_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditSELCCLA}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
      //Plantilla de localizar imagen
      case tabs.openLOCIMG:
        return (
          <LOCIMG
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      //MULTIMG
      //El editor es el mismo que el de SELECIMG
      case tabs.openMULTIMG:
        return (
          <MULTIMG
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      //INGRNUM
      case tabs.openINGRNUM:
        return (
          <INGRNUM
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      //INGRNUM_resp
      case tabs.openEditINGRNUM:
        return (
          <INGRNUM_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditINGRNUM}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
      //OPCLAVA
      case tabs.openOPCLAVA:
        return (
          <OPCLAVA
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      //openEditOPCLAVA
      case tabs.openEditOPCLAVA:
        return (
          <OPCLAVA_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditOPCLAVA}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
      //  OPCLAV2,
      case tabs.openOPCLAV2:
        return (
          <OPCLAV2
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openEditOPCLAV2:
        return (
          <OPCLAV2_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditOPCLAV2}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
      //MULIMGT
      case tabs.openMULIMGT:
        return (
          <MULIMGT
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openEditMULIMGT:
        return (
          <MULIMGT_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditMULIMGT}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
      //SELCCMA
      case tabs.openSELCCMA:
        return (
          <SELCCMA
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openEditSELCCMA:
        return (
          <SELCCMA_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditSELCCMA}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
      //ENSEMUL
      case tabs.openENSEMUL:
        return (
          <ENSEMUL
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openEditENSEMUL:
        return (
          <ENSEMUL_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditENSEMUL}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
      //ENINMAN
      case tabs.openENINMAN:
        return (
          <ENINMAN
            cambiarPestañas={cambiarPestañas}
            tipo_preg={tabInfo.IDTIPOPRE}
            id_nivel={tabInfo.IDNivel}
            icono={tabInfo.r_icono}
            AbrirEditor={AbrirEditor}
          />
        );
      case tabs.openEditENINMAN:
        return (
          <ENINMAN_resp
            id_pregunta={tabInfo.idPregunta}
            buscar={tabInfo.buscarEditENINMAN}
            id_nivel={tabInfo.IDNivel}
            AbrirPreguntas={AbrirPreguntas}
            idni={tabInfo.IDNivel}
            nombrenivel={tabInfo.nombre_nivel}
            //
          />
        );
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
      <Head>
        <title>Secciones</title>
      </Head>
      <BarraNavegacion2
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="xl:ml-72 ">
        <Navbar_app user_name={data_user.r_user_name_ab} titulo={"Secciones"} />
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
Secciones.displayName = "/src/layout/dashboard.jsx";
///src/layout/dashboard.jsx
//export default Home;
