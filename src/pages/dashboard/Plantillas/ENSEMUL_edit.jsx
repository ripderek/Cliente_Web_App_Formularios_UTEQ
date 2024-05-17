import { useState, useEffect } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets";
import axios from "axios";

import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  IconButton,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  UserPlusIcon,
  ArrowRightCircleIcon,
  PencilIcon,
  PlusCircleIcon,
  UsersIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { data } from "autoprefixer";
export default function ENSEMUL_edit({ cerrar, idpregunta }) {
  //obtener los datos de la preguta+
  //
  useEffect(() => {
    obtener_datos_pregunta();
    //else buscar_por_id
  }, []);
  const [load, setLoader] = useState(false);

  const obtener_datos_pregunta = async () => {
    //alert(id_pregunta + " " + buscar + " " + id_nivel);
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/SELCIMG_Datos_pregunta_id_pregunta/" +
          idpregunta,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      // SetidPreguntaEdit(idpregunta);
      setData_User(data);
      setLoader(false);
      //setIdPregunta(data.r_id_pregunta);
      //cargarRespuestas(data.r_id_pregunta);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const [data_user, setData_User] = useState([]);
  //funncion para enviar a editar
  const EditarPregunta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      //console.log(data_user);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "preguntas/EditaerPreguntaSELCCMA",
        data_user,
        {
          withCredentials: true,
        }
      );

      setLoader(false);
      cerrar();
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
    }
  };
  return (
    <>
      <Dialog size="xl" open={true} handler={cerrar}>
        {load ? <Loader /> : ""}

        <DialogBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Editar pregunta
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
          <Typography variant="h5" color="gray">
            Enunciado:
          </Typography>
          <textarea
            className="border p-2 rounded-sm font-bold w-full h-full mt-3"
            rows={5} // Número de filas
            cols={50} // Número de columnas
            value={data_user.r_enunciado}
            placeholder="Aquí escribe la pregunta"
            onChange={(e) =>
              setData_User({ ...data_user, r_enunciado: e.target.value })
            }
          />
        </DialogBody>
        <DialogFooter className="pt-0">
          <Button variant="gradient" color="green" onClick={EditarPregunta}>
            Aceptar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
