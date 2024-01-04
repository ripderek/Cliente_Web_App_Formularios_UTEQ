import { useEffect, useState } from "react";
import { NavBarFormsLogin, NavBarForms } from "@/components/FormsLayout";
import { ProgresoSecciones } from "@/pages/FormulariosOP";
import { MEMRZAR_resolv } from "@/pages/dashboard/Plantillas";
export default function Test() {
  //este componente sera todo el negocio del test
  //Hacer un switch para renderize el componente que se requiera visualizar
  const [openProgresoSecciones, setOpenProgresoSecciones] = useState(true);

  ///[
  //IMPORTANTE PRIMERO HAY QUE OBTENER LA PREGUNTA DE UNA SECCION
  //PARA PODER SABER CUAL TIPO DE PREGUNTA ES Y ABRIR LA INTERFAZ
  ///                 ]

  //funcion que simula esa funcionalidad
  const [idProgresoSeccion, setIdProgresoSeccion] = useState(0);
  const openQuestion = (r_id_progreso_seccion, tipo) => {
    setIdProgresoSeccion(r_id_progreso_seccion);
    if (tipo === "MEMRZAR") handlerMEMRZAR();
    //con el r_id_progreso_seccion hay que cargar la ultima pregunta de ese progreso y enviarla a la interfaz
  };

  //funcion para abrir una pregunta de tipo MEMRZAR
  //id_pregunta, id_progreso_pregunta
  const [openMEMRZAR, setOpenMEMRZAR] = useState(false);
  const handlerMEMRZAR = () => {
    setOpenMEMRZAR(true);
    setOpenProgresoSecciones(false);
  };
  const renderComponent = () => {
    switch (true) {
      case openProgresoSecciones:
        return <ProgresoSecciones openQuestion={openQuestion} />;
      case openMEMRZAR:
        return (
          <MEMRZAR_resolv
            id_pregunta="28"
            id_progreso_sec={idProgresoSeccion}
          />
        );
      /* 
      case openParticipantes:
        return <Participantes idTest_id={idTest} Regresar={Regresar} />;
      case openSeleccionarSeccion:
        return <SeleccionarSecciones idTest_id={idTest} Regresar={Regresar} />;
        */
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
