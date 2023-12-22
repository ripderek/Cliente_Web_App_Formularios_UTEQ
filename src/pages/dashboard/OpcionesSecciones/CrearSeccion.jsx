import { useState, useEffect } from "react";
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
} from "@material-tailwind/react";
import Cookies from "universal-cookie";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

import { XCircleIcon } from "@heroicons/react/24/solid";
export default function CrearSeccion({ abrir, cerrar, crear }) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen((cur) => !cur);
  const cookies = new Cookies();

  //estado para almacenar la info de la seccion
  const [seccion, setSeccion] = useState({
    p_titulo: "",
    p_descripcion: "",
    p_id_usuario_crea: cookies.get("id_user"),
  });
  //funcino para guardar en el json las variables para enviar al form
  const HandleChange = (e) => {
    setSeccion({ ...seccion, [e.target.name]: e.target.value });
  };
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  //variable para mostrar el loader cuando carga una peticion
  const [load, setLoader] = useState(false);
  useEffect(() => {
    setError(false);
    setMensajeError("");
    setLoader(false);
    
  }, []);
  //funcion para crear la seccion
  const Crear_Seccion = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "secciones/Crear_Seccion",
        seccion,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      crear(true);
      cerrar(false);
    } catch (error) {
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
      <Dialog
        size="xs"
        open={abrir}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
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
              Crear Seccion
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
              label="Titulo"
              size="lg"
              name="p_titulo"
              onChange={HandleChange}
            />

            <Input
              label="Descripcion"
              size="lg"
              name="p_descripcion"
              onChange={HandleChange}
            />
            {/* 
            <div className="-ml-2.5 -mt-3">
              <Checkbox label="Remember Me" />
            </div>
            */}
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              onClick={Crear_Seccion}
              fullWidth
              color="green"
            >
              Aceptar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
