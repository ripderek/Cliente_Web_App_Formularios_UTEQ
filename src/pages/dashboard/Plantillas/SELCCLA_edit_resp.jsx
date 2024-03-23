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

export default function SELCCLA_edit_resp({ cerrar, idpregunta, Numerico }) {
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
          "preguntas/DataRespuestaID/" +
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
      setIsChecked(data.r_correcta);
      //setIdPregunta(data.r_id_pregunta);
      //cargarRespuestas(data.r_id_pregunta);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  const [data_user, setData_User] = useState([]);
  //funncion para enviar a editar
  const EditarPregunta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      //console.log(data_user);
      //enviar tambien el estado check
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/sp_editar_respuesta_selccla",
        {
          r_id_respuesta: data_user.r_id_respuesta,
          r_opcion: data_user.r_opcion,
          estado_correcta: isChecked,
        },
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
      setMensajeError(error.response.data.message);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  //para el checkbox
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const cerrar1 = (valor) => {
    setError(valor);
  };
  return (
    <>
      <Dialog size="xl" open={true} handler={cerrar}>
        {load ? <Loader /> : ""}
        {error && (
          <Dialog_Error
            mensaje={mensajeError}
            titulo="Error al llenar el formulario"
            cerrar={cerrar1}
          />
        )}
        <DialogBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Editar respuesta
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
          {Numerico ? (
            <div>
              <Input
                value={data_user.r_opcion}
                onChange={(e) =>
                  setData_User({ ...data_user, r_opcion: e.target.value })
                }
                type="number"
              />
            </div>
          ) : (
            <textarea
              className="border p-2 rounded-sm font-bold w-full h-full mt-3"
              rows={5} // Número de filas
              cols={50} // Número de columnas
              value={data_user.r_opcion}
              placeholder="Aquí escribe la pregunta"
              onChange={(e) =>
                setData_User({ ...data_user, r_opcion: e.target.value })
              }
            />
          )}

          <div className="flex items-center">
            <Typography className="text-lg font-bold" color="black">
              ¿Respuesta Correcta?:
            </Typography>
            <Checkbox
              color="green"
              checked={isChecked}
              onChange={handleChange}
            />
          </div>
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
