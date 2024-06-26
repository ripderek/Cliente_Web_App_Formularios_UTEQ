import { useEffect, useState } from "react";
import { NavBarFormsLogin, NavBarForms } from "@/components/FormsLayout";
import { ProgresoSecciones } from "@/pages/FormulariosOP";
import Head from "next/head";

import {
  MEMRZAR_resolv,
  SELCIMG_resolv,
  SELCCLA_resolv,
  LOCIMG_resolv,
  MULTIMG_resolv,
  INGRNUM_resolv,
  OPCLAVA_resolv,
  OPCLAV2_resolv,
  MULIMGT_resolv,
  SELCCMA_resolv,
  ENSEMUL_resolv,
  ENINMAN_resolv,
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
    //alert(tipo);
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
      //INGRNUM_resp
      case "INGRNUM":
        handlerINGRNUM();
        break;
      //handlerOPCLAVA
      case "OPCLAVA":
        handlerOPCLAVA();
        break;
      case "OPCLAV2":
        handlerOPCLAV2();
        break;
      case "MULIMGT":
        handlerMULIMGT();
        break;
      case "SELCCMA":
        handlerSELCCMA();
        break;
      case "ENSEMUL":
        handlerENSEMUL();
        break;
      case "ENINMAN":
        handlerENINMAN();
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
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
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
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
  };

  const [openSELCCLA, setOpenSELCCLA] = useState(false);
  const handlerSELCCLA = () => {
    setOpenSELCCLA(true);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenLOCIMG(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
  };
  const [openLOCIMG, setOpenLOCIMG] = useState(false);

  const handlerLOCIMG = () => {
    setOpenLOCIMG(true);
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
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
    setOpenOPCLAVA(false);
    setOpenINGRNUM(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
  };
  //funcion para resolver la pregunta de ingresar numero
  //INGRNUM_resp
  const [openINGRNUM, setOpenINGRNUM] = useState(false);
  const handlerINGRNUM = () => {
    setOpenINGRNUM(true);
    setOpenLOCIMG(false);
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenMULTIMG(false);
    setOpenOPCLAVA(false);
    setOpenProgresoSecciones(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
  };
  //OPCLAVA_resolv
  const [openOPCLAVA, setOpenOPCLAVA] = useState(false);
  const handlerOPCLAVA = () => {
    setOpenOPCLAVA(true);
    setOpenLOCIMG(false);
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenProgresoSecciones(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
  };
  //  OPCLAV2_resolv,
  const [openOPCLAV2, setOpenOPCLAV2] = useState(false);
  const handlerOPCLAV2 = () => {
    setOpenOPCLAV2(true);
    setOpenLOCIMG(false);
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenProgresoSecciones(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
  };
  //MULIMGT_resolv
  const [openMULIMGT, setOpenMULIMGT] = useState(false);
  const handlerMULIMGT = () => {
    setOpenMULIMGT(true);
    setOpenOPCLAV2(false);
    setOpenLOCIMG(false);
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenProgresoSecciones(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
  };

  //SELCCMA
  const [openSELCCMA, setOpenSELCCMA] = useState(false);
  const handlerSELCCMA = () => {
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenLOCIMG(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
    setOpenSELCCMA(true);
  };

  //ENSEMUL
  const [openENSEMUL, setOpenENSEMUL] = useState(false);
  const handlerENSEMUL = () => {
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenLOCIMG(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENINMAN(false);
    setOpenENSEMUL(true);
  };

  //ENINMAN
  const [openENINMAN, setOpenENINMAN] = useState(false);
  const handlerENINMAN = () => {
    setOpenSELCCLA(false);
    setOpenSELCIMG(false);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
    setOpenLOCIMG(false);
    setOpenMULTIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenOPCLAV2(false);
    setOpenMULIMGT(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(true);
  };

  //funcion regresar a un progreso seccion
  //necesita el id del progreso_seccion para abrirse xd
  const RegresarProgresoSeccion = (value) => {
    setOpenMULIMGT(false);
    setOpenOPCLAV2(false);
    setsiguient(true);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(true);
    setOpenSELCIMG(false);
    setOpenSELCCLA(false);
    setOpenLOCIMG(false);
    setOpenINGRNUM(false);
    setOpenOPCLAVA(false);
    setOpenSELCCMA(false);
    setOpenENSEMUL(false);
    setOpenENINMAN(false);
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
      //INGRNUM_resp
      //openINGRNUM
      case openINGRNUM:
        return (
          <INGRNUM_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      //openOPCLAVA
      case openOPCLAVA:
        return (
          <OPCLAVA_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      case openOPCLAV2:
        return (
          <OPCLAV2_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      //openMULIMGT
      case openMULIMGT:
        return (
          <MULIMGT_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      //openSELCCMA
      case openSELCCMA:
        return (
          <SELCCMA_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      //openENSEMUL
      case openENSEMUL:
        return (
          <ENSEMUL_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
          />
        );
      //openENINMAN
      case openENINMAN:
        return (
          <ENINMAN_resolv
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
      <Head>
        <title>Formulario</title>
      </Head>
      <NavBarForms />
      {/*
            Renderizar el componente del Switch
             */}
      {renderComponent()}
    </>
  );
}
