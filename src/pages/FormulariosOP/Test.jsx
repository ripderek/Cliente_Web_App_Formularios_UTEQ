import { useEffect, useState } from "react";
import { NavBarFormsLogin, NavBarForms } from "@/components/FormsLayout";
import { ProgresoSecciones } from "@/pages/FormulariosOP";
import { MEMRZAR_resolv, SELCIMG_resolv } from "@/pages/dashboard/Plantillas";
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
      default:
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
  };
  //Funcion para abrir una pregunta de tipo SELCIMG
  const [openSELCIMG, setOpenSELCIMG] = useState(false);
  const handlerSELCIMG = () => {
    setOpenSELCIMG(true);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(false);
  };

  //funcion regresar a un progreso seccion
  //necesita el id del progreso_seccion para abrirse xd
  const RegresarProgresoSeccion = (value) => {
    setsiguient(value);
    setOpenMEMRZAR(false);
    setOpenProgresoSecciones(true);
    //setIdProgresoSeccion(id_progreso_sec);
    setOpenSELCIMG(false);
  };
  const [load, setLoader] = useState(false);

  //hacer una funcion que retorne el avance de las preguntas segun la seccion y devuelva la ultima pregunta
  const [SiguientePre, SetSiguientePre] = useState([]);
  const click = async () => {
    //aqui se necesita obtener la siguiente pregunta sin resolver del participante
    //id de la pregunta,
    //tipo de pregunta,
    //id_progreso_pregunta
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/ProgresoPreguntasSeccion/" +
          cookies.get("id_user") +
          "/" +
          cookies.get("token_test") +
          "/" +
          idSeccion,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetSiguientePre(data);
      alert("Datos de la siguiente pregunta cargados");
      console.log(data);
      //AQUI HACER UN SWITCH PARA SABER EL TIPO DE PREGUNTA QUE SE VA ABRIR PARA RESOLVER
      if (data) {
        openQuestion(
          idProgresoSeccion,
          data.r_codigo,
          data.r_id_pregunta,
          data.r_id_progreso_preguntas
        );
      } else {
        alert("Ya esta completa la seccion");
        RegresarProgresoSeccion();
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      console.log(error);
    }
  };
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
            click={click}
          />
        );
      case openSELCIMG:
        return (
          <SELCIMG_resolv
            id_pregunta={idPregunta}
            id_progreso_sec={idProgresoSeccion}
            RegresarProgresoSeccion={RegresarProgresoSeccion}
            ProgresoPregunta={id_progrso_pregunta}
            click={click}
          />
        );
      case Loader:
        return <Loader />;
      default:
        return null; // Otra opción por defecto si ninguna condición es verdadera
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
