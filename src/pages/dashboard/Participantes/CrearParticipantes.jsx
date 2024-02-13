import {
  Button,
  Dialog,
  Input,
  IconButton,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import Lottie from "lottie-react";
//import anim from "../../public/anim/error.json";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import axios from "axios";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
export default function CrearParticipantes({ cerrar }) {
  const [participante, setParticipante] = useState({
    p_correo_institucional: "",
    p_nombres_apellido: "",
  });
  const [load, setLoader] = useState(false);
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  //funcino para guardar en el json las variables para enviar al form
  const HandleChange = (e) => {
    setParticipante({ ...participante, [e.target.name]: e.target.value });
  };
  //funcion para crear un participantes
  const CrearParticipante = async () => {
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "participantes/crear_participantes",
        participante,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      cerrar(true);
    } catch (error) {
      console.log(error);
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const cerrar1 = (valor) => {
    setError(valor);
  };
  return (
    <>
      <Dialog open={true} size="xs">
        {load ? <Loader /> : ""}
        {error ? (
          <Dialog_Error
            mensaje={mensajeError}
            titulo="Error al llenar el formulario"
            cerrar={cerrar1}
          />
        ) : (
          ""
        )}
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Crear Participantes
            </Typography>
            <IconButton
              className="!absolute top-3 right-3 bg-transparent shadow-none"
              onClick={() => cerrar(false)}
            >
              <XCircleIcon className="w-11" color="orange" />
            </IconButton>

            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Llene el formulario
            </Typography>

            <Input
              label="Correo Institucional"
              className="p-4 mb-11"
              onChange={HandleChange}
              name="p_correo_institucional"
            />
            <Input
              label="Nombres y Apellidos"
              onChange={HandleChange}
              name="p_nombres_apellido"
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              color="green"
              onClick={CrearParticipante}
            >
              Aceptar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
