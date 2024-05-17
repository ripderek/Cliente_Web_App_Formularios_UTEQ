import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Tooltip,
  Select,
  Option,
} from "@material-tailwind/react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ArrowRightCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
const TABLE_HEAD = ["Nivel Inicial", "Nivel Salto", ""];

export default function CrearSalto({ id_test, id_seccion, cerrar }) {
  const [load, setLoader] = useState(false);
  //obtener los niveles permitidos para consultar las preguntas
  const [ListaSaltos, SetListaSaltos] = useState([]);
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  const Obtener_Secciones_Usuario = async () => {
    //cargar solo las secciones que contiene el formulario
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/fu_listar_niveles_saltos_seleccion/" +
          id_test,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetListaSaltos(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
      console.log(error);
    }
  };
  return (
    <>
      <Dialog open={true} handler={cerrar}>
        {load && <Loader />}
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Crear Salto
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
          <div className="flex-row mx-auto text-center bg-white">
            <Select label="Seleccione un nivel">
              {ListaSaltos.map(
                (
                  {
                    r_id_test_niveles,
                    r_id_nivel,
                    r_nivel,
                    r_id_test_secciones,
                  },
                  index
                ) => (
                  <Option key={index}>Nivel: {r_nivel}</Option>
                )
              )}
            </Select>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
