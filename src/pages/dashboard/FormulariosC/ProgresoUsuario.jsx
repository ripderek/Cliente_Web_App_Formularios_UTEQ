import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ProgresoSecciones,
  ProgresoPregunta,
} from "@/pages/dashboard/FormulariosC";
export default function ProgresoUsuario({
  idParticipante,
  cerrar,
  nombreUsuario,
}) {
  const [load, setLoader] = useState(false);

  const [openSecciones, SetOpensecciones] = useState(true);
  const [openPreguntas, setOpenPreguntas] = useState(false);
  const [id_seccion, setIdseccion] = useState(0);
  const AbrirPreguntas = (id_se) => {
    setIdseccion(id_se);
    SetOpensecciones(false);
    setOpenPreguntas(true);
  };
  const CerrarPreguntas = () => {
    setOpenPreguntas(false);
    SetOpensecciones(true);
  };
  return (
    <>
      {load && <Loader />}
      <Dialog open={true} handler={cerrar} size="xl">
        <DialogHeader>
          Progreso
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <span className="font-bold text-black">{nombreUsuario}</span>{" "}
          {openSecciones && (
            <ProgresoSecciones
              id_participante_test={idParticipante}
              abrirSeccion={AbrirPreguntas}
            />
          )}
          {openPreguntas && (
            <ProgresoPregunta
              id_participante={idParticipante}
              regresar={CerrarPreguntas}
              id_seccion_progreso={id_seccion}
            />
          )}
        </DialogBody>
      </Dialog>
    </>
  );
}
