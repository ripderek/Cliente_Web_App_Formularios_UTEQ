import { useState, useEffect } from "react";
import Router from "next/router";

import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
} from "@material-tailwind/react";
import {
  PencilIcon,
  UserPlusIcon,
  ArrowRightCircleIcon,
  UsersIcon,
  XCircleIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/solid";
import Cookies from "universal-cookie";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

export default function Logouth({ Cancelar }) {
  const [load, setLoader] = useState(false);
  const cookies = new Cookies();

  //funcion para actualizar la informacion del usuario
  const CerrarSesion = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");

    try {
      setLoader(true);
      //Actualizar la contrasena

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "auth/Logouth",
        "",
        {
          withCredentials: true,
        }
      );
      cookies.set("myTokenName", result.data.token, { path: "/" }); //enviar cokiee y almacenarla
      //Cookie para el id del usuario
      cookies.set("id_user", result.data.id, { path: "/" });
      cookies.remove("myTokenName");
      cookies.remove("id_user");
      setLoader(false);
      const nuevaRuta = "/dashboard/Home"; //
      Router.push(nuevaRuta);
      //agregar_seccion();
      //aqui refrescar la paguina y redireccionar hacia el inicio de sesion
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.message);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const cerrar1 = (valor) => {
    setError(valor);
  };
  return (
    <>
      {load && <Loader />}

      <Dialog open={true} handler={Cancelar}>
        {error && (
          <Dialog_Error
            mensaje={mensajeError}
            titulo="Error al llenar el formulario"
            cerrar={cerrar1}
          />
        )}
        <DialogHeader>Cerrar Sesión</DialogHeader>
        <DialogBody>¿Esta seguro que desea cerrar la sesión?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={Cancelar}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={CerrarSesion}>
            <span>Aceptar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
