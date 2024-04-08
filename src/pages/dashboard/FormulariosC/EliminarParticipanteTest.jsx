import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Alert,
} from "@material-tailwind/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import axios from "axios";

export default function EliminarParticipanteTest({
  cerrar,
  id_participante_test,
  nombreUsuario,
  cerrar2,
}) {
  const [load, setLoader] = useState(false);
  //funcion para eliminar el particpant
  const EliminarTest = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/EliminarParticipanteTest/" +
          id_participante_test,
        "",
        {
          withCredentials: true,
        }
      );
      //setLoader(false);
      //agregar_seccion();
      //setOpenDetalles(false);
      //setDeseaEliminar(false);
      //Obtener_Secciones_Usuario();
      cerrar2();
    } catch (error) {
      setLoader(false);
      console.log(error);
      alert("Error");
      //colocar una alerta de error cuando no se pueda inciar sesion
      //setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      //setError(true);
    }
  };
  return (
    <>
      {load && <Loader />}
      <Dialog open={true} handler={cerrar}>
        <DialogHeader className="bg-green-50">
          Eliminar Participante.
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          Si elimina al participante:
          <span className="font-bold">{nombreUsuario}</span> se perderá todo su
          progreso y también afectará a las estadísticas.
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={EliminarTest}>
            <span>Aceptar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
