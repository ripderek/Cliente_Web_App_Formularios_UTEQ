import { useEffect, useState } from "react";
import { NavBarFormsLogin, NavBarForms } from "@/components/FormsLayout";
import { ProgresoSecciones } from "@/pages/FormulariosOP";
import {
  MEMRZAR_resolv,
  SELCIMG_resolv,
  SELCCLA_resolv,
  LOCIMG_resolv,
  MULTIMG_resolv,
} from "@/pages/dashboard/Plantillas";
import Cookies from "universal-cookie";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

export default function Test() {
  const cookies = new Cookies();

  //este componente sera todo el negocio del test
  //Hacer un switch para renderize el componente que se requiera visualizar
  const [openProgresoSecciones, setOpenProgresoSecciones] = useState(true);

  ///[
  //IMPORTANTE PRIMERO HAY QUE OBTENER LA PREGUNTA DE UNA SECCION
  //PARA PODER SABER CUAL TIPO DE PREGUNTA ES Y ABRIR LA INTERFAZ
  ///                 ]

  //funcion que simula esa funcionalidad
  const [idProgresoSeccion, setIdProgresoSeccion] = useState(0);
  const [idPregunta, set_IDPregunta] = useState(0);
  const [idSeccion, setIDSeccion] = useState(0);

  const [id_progrso_pregunta, setIDprogresoPregunta] = useState(0);
  const openQuestion = (
    r_id_progreso_seccion,
    tipo,
    idp,
    id_progreso_pregunt,
    id_sec
  ) => {
    setIdProgresoSeccion(r_id_progreso_seccion);
    set_IDPregunta(idp);
    setIDprogresoPregunta(id_progreso_pregunt);
    setIDSeccion(id_sec);
    switch (tipo) {
      case "MEMRZAR":
        handlerMEMRZAR();
        break;
      case "SELCIMG":
        handlerSELCIMG();
        break;
      case "SELCCLA":
        handlerSELCCLA();
        break;
      case "LOCIMG":
        handlerLOCIMG();
        break;
      //MULTIMG
      case "MULTIMG":
        handlerMULTIMG();
        break;
      default:
        RegresarProgresoSeccion(true);
        break;
      // Código para el caso por defecto (si tipo no coincide con ninguno de los casos)
    }
    //con el r_id_progreso_seccion hay que cargar la ultima pregunta de ese progreso y enviarla a la interfaz
  };

  //funcion para abrir una pregunta de tipo MEMRZAR
  //id_pregunta, id_progreso_pregunta
  const [openMEMRZAR, setOpenMEMRZAR] = useState(false);
  const handlerMEMRZAR = () => {
    setOpenMEMRZAR(true);
    setOpenProgresoSecciones(false);
    setOpenSELCIMG(false);
    setOpenSELCCLA(false);
    setOpenLOCIMG(false);
    setOpenMULTIMG(false);
  };
  //Funcion para abrir una pregunta de tipo SELCIMG
  const [openSELCIMG, setOpenSELCIMG] = useState(false);
  const handlerSELCIMG = () => {
    setOpenSELCIMG(true);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenSELCCLA(false);
    setOpenLOCIMG(false);
    setOpenMULTIMG(false);
  };

  const [openSELCCLA, setOpenSELCCLA] = useState(false);
  const handlerSELCCLA = () => {
    setOpenSELCCLA(true);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenLOCIMG(false);
    setOpenMULTIMG(false);
  };
  const [openLOCIMG, setOpenLOCIMG] = useState(false);

  const handlerLOCIMG = () => {
    setOpenLOCIMG(true);
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenMULTIMG(false);
  };
  //        handlerMULTIMG();
  const [openMULTIMG, setOpenMULTIMG] = useState(false);

  const handlerMULTIMG = () => {
    setOpenMULTIMG(true);
    setOpenLOCIMG(false);
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
  };

  //funcion regresar a un progreso seccion
  //necesita el id del progreso_seccion para abrirse xd
  const RegresarProgresoSeccion = (value) => {
    setsiguient(true);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(true);
    setOpenSELCIMG(false);
    setOpenSELCCLA(false);
    setOpenLOCIMG(false);
  };

  const [load, setLoader] = useState(false);

  //hacer una funcion que retorne el avance de las preguntas segun la seccion y devuelva la ultima pregunta

  const [siguiente, setsiguient] = useState(false);
  const renderComponent = () => {
    switch (true) {
      case openProgresoSecciones:
        return (
          <ProgresoSecciones
            openQuestion={openQuestion}
            siguiente={siguiente}
            r_id_progreso_seccion_p={idProgresoSeccion}
            id_sec_p={idSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
          />
        );
      case openMEMRZAR:
        return (
          <MEMRZAR_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      case openSELCIMG:
        return (
          <SELCIMG_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      //openSELCCLA
      case openSELCCLA:
        return (
          <SELCCLA_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      case openLOCIMG:
        return (
          <LOCIMG_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      //openMULTIMG
      case openMULTIMG:
        return (
          <MULTIMG_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      default:
        return (
          <ProgresoSecciones
            openQuestion={openQuestion}
            siguiente={siguiente}
            r_id_progreso_seccion_p={idProgresoSeccion}
            id_sec_p={idSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
          />
        ); // Otra opción por defecto si ninguna condición es verdadera
    }
  };
  return (
    <>
      <NavBarForms />
      {/*
            Renderizar el componente del Switch
             */}
      {renderComponent()}
    </>
  );
}
