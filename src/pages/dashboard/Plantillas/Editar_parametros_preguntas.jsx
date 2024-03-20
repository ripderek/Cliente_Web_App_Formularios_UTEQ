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
export default function Editar_parametros_preguntas({
  cerrar,
  idpregunta,
  TieneTiempoEnunciado,
  TieneTiempoRespuesta,
}) {
  //obtener los datos de la preguta+
  //
  useEffect(() => {
    obtener_datos_pregunta();
    //else buscar_por_id
  }, []);
  const [load, setLoader] = useState(false);

  const obtener_datos_pregunta = async () => {
    //alert(id_pregunta + " " + buscar + " " + id_nivel);
    //COMO ES DE TIPO MEMRZAR HAY QUE OBTENER LOS PARAMETROS, como imagene enunciado, tiempo respuesta, tiempo enunciado,etc
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
      setTiempoRes(data.r_tiempo_segundo);
      setTiempoIMG(data.r_tiempo_enunciado);
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
      //data_user.r_enunciado
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/Editar_parametros_pregunta",
        {
          r_id_pregunta: idpregunta,
          r_enunciado: data_user.r_enunciado,
          tiene_tiempo_resp: TieneTiempoRespuesta,
          tiempo_responder: TiempoRes,
          tiene_tiempo_ver: TieneTiempoEnunciado,
          tiempo_ver: TiempoIMG,
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
      alert("Error");
    }
  };
  //estado para los parametros de la pregunta
  const [TiempoRes, setTiempoRes] = useState(0);
  const [TiempoIMG, setTiempoIMG] = useState(0);
  return (
    <>
      <Dialog size="xl" open={true} handler={cerrar}>
        {load ? <Loader /> : ""}

        <DialogBody className="flex flex-col gap-4 overflow-x-auto">
          <div className="h-96 ">
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
              className="border p-2 rounded-sm font-bold w-full h-auto mt-3"
              rows={1} // Número de filas
              cols={2} // Número de columnas
              value={data_user.r_enunciado}
              placeholder="Aquí escribe la pregunta"
              onChange={(e) =>
                setData_User({ ...data_user, r_enunciado: e.target.value })
              }
            />
            {/*
            <img
              src={
                process.env.NEXT_PUBLIC_ACCESLINK +
                "preguntas/Ver_ImagenPregunta/" +
                idpregunta
              }
              alt="Imagen"
              className="mt-3 h-64 w-auto mx-auto"
            />
             */}
            {TieneTiempoRespuesta && (
              <div className="flex items-center">
                <Typography className="text-lg font-bold" color="black">
                  Tiempo disponible para responder (segundos):
                </Typography>
                <input
                  className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
                  type="number"
                  value={TiempoRes}
                  onChange={(e) => setTiempoRes(e.target.value)}
                />
              </div>
            )}
            {TieneTiempoEnunciado && (
              <div className="flex items-center">
                <Typography className="text-lg font-bold" color="black">
                  Tiempo disponible para memorizar la imagen (segundos):
                </Typography>
                <input
                  className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
                  type="number"
                  value={TiempoIMG}
                  onChange={(e) => setTiempoIMG(e.target.value)}
                />
              </div>
            )}

            {/* 
            <div className="flex items-center">
              <Typography className="text-lg font-bold" color="black">
                Tiempo disponible para memorizar la imagen (segundos):
              </Typography>
              <input
                className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
                type="number"
                value={TiempoIMG}
                onChange={(e) => setTiempoIMG(e.target.value)}
              />
            </div>
*/}
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
