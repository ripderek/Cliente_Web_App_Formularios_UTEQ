import { useState, useEffect } from "react";
import {
  XCircleIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import {
  IngresosUsuario,
  ProgresoUsuario,
  EliminarParticipanteTest,
} from "@/pages/dashboard/FormulariosC";
export default function OpcionesParticipantes({
  cerrar,
  id_participante,
  nombreParticipante,
}) {
  //estado para cambiar las ventanas
  const [tabs, setTabs] = useState({
    openIngresos: false,
    openProgreso: false,
    openEliminar: false,
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
  const cerrarPestanad = (nuevaPestaña) => {
    setTabs((prevTabs) => ({
      ...Object.fromEntries(
        Object.entries(prevTabs).map(([key]) => [key, false])
      ),
    }));
  };
  //Esta funion es para eliminar el participante y recargar
  const cerrarPestanad1 = (nuevaPestaña) => {
    setTabs((prevTabs) => ({
      ...Object.fromEntries(
        Object.entries(prevTabs).map(([key]) => [key, false])
      ),
    }));
    cerrar();
  };
  const renderComponent = () => {
    switch (true) {
      case tabs.openIngresos:
        return (
          <IngresosUsuario
            cerrar={cerrarPestanad}
            idParticipante={id_participante}
            nombreUsuario={nombreParticipante}
          />
        );
      case tabs.openProgreso:
        return (
          <ProgresoUsuario
            cerrar={cerrarPestanad}
            idParticipante={id_participante}
            nombreUsuario={nombreParticipante}
          />
        );
      case tabs.openEliminar:
        return (
          <EliminarParticipanteTest
            cerrar={cerrarPestanad}
            id_participante_test={id_participante}
            nombreUsuario={nombreParticipante}
            cerrar2={cerrarPestanad1}
          />
        );
      default:
        return null; // Otra opción por defecto si ninguna condición es verdadera
    }
  };
  return (
    <div>
      <Dialog open={true} handler={cerrar} size="xl">
        {renderComponent()}
        <DialogHeader className="bg-green-50">
          <div>
            Opciones participante
            <IconButton
              className="!absolute top-3 right-3 bg-transparent shadow-none"
              onClick={cerrar}
            >
              <XCircleIcon className="w-11" color="orange" />
            </IconButton>
          </div>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5">
            <div
              key={0}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
              onClick={() => cambiarPestañas(`open${"Ingresos"}`)}
            >
              <div className="mx-auto">
                <div className="text-center mt-2 ">
                  <ArrowRightOnRectangleIcon
                    className="h-16 mx-auto bg-white w-auto rounded-xl"
                    color="orange"
                  />
                </div>
                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span> Ingresos </span>
                </div>
              </div>
            </div>
            <div
              key={1}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
              onClick={() => cambiarPestañas(`open${"Progreso"}`)}
            >
              <div className="mx-auto">
                <div className="text-center mt-2 ">
                  <AdjustmentsHorizontalIcon
                    className="h-16 mx-auto bg-white w-auto rounded-xl"
                    color="blue"
                  />
                </div>

                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span>Progreso </span>
                </div>
              </div>
            </div>
            <div
              key={2}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
              onClick={() => cambiarPestañas(`open${"Eliminar"}`)}
            >
              <div className="mx-auto">
                <div className="text-center mt-2 ">
                  <XCircleIcon
                    className="h-16 mx-auto bg-white w-auto rounded-xl"
                    color="red"
                  />
                </div>

                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span>Expulsar </span>
                </div>
              </div>
            </div>
            {/* 
            <div
              key={3}
              className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
            >
              <div className="mx-auto">
                <div className="text-center mt-2 ">
                  <ArrowPathIcon
                    className="h-16 mx-auto bg-white w-auto rounded-xl"
                    color="black"
                  />
                </div>

                <div className="w-full p-4 text-center font-bold text-black text-xl">
                  <span>Reestablecer progreso </span>
                </div>
              </div>
            </div>
*/}
          </div>
        </DialogBody>
        <DialogFooter>{/*  AQUI VA EL FOOTER SI ES NECESARIO */}</DialogFooter>
      </Dialog>
    </div>
  );
}
