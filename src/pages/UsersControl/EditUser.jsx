import { useState, useEffect } from "react";
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

export default function EditUser({ cerrarEdicion, realizado }) {
  const [infoUser, setInfoUser] = useState([]);
  const [load, setLoader] = useState(false);
  const cookies = new Cookies();
  useEffect(() => {
    ObtenerInfoUser();
  }, []);
  const ObtenerInfoUser = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "users/Datos_Usuario/" +
          cookies.get("id_user"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setInfoUser(data);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setInfoUser({ ...infoUser, [e.target.name]: e.target.value });
  };
  //funcion para actualizar la informacion del usuario
  const ActualizarInformacionUsuario = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      //ahora enviar el id del test, id de la seccion y Json con los niveles
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "users/sp_actualizar_info_user",
        {
          p_nombres_apellidos: infoUser.r_nombres_apellidos,
          p_identificacion: infoUser.r_identificacion,
          p_numero_celular: infoUser.r_numero_celular,
          p_id_user: cookies.get("id_user"),
        },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      //agregar_seccion();
      realizado();
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

      <Dialog open={true} handler={cerrarEdicion}>
        {error && (
          <Dialog_Error
            mensaje={mensajeError}
            titulo="Error al llenar el formulario"
            cerrar={cerrar1}
          />
        )}
        <DialogHeader className="bg-green-50">
          <Typography variant="h4" color="blue-gray">
            Editar Perfil
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrarEdicion}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>

        <Card className="mx-auto w-full shadow-none">
          <CardBody className="flex flex-col gap-4 overflow-y-auto h-64 shadow-none">
            <Input
              label="Nombres y apellidos"
              size="lg"
              name="r_nombres_apellidos"
              value={infoUser.r_nombres_apellidos}
              onChange={handleChange}
            />
            <Input
              label="Identificacion"
              size="lg"
              name="r_identificacion"
              value={infoUser.r_identificacion}
              onChange={handleChange}
              maxLength={10}
            />
            <Input
              label="Correo institucional"
              size="lg"
              name="r_correo_institucional"
              value={infoUser.r_correo_institucional}
              disabled
            />
            <Input
              label="Numero Celular"
              size="lg"
              name="r_numero_celular"
              value={infoUser.r_numero_celular}
              onChange={handleChange}
              maxLength={10}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              onClick={ActualizarInformacionUsuario}
              fullWidth
              color="green"
            >
              Aceptar
            </Button>
          </CardFooter>
        </Card>
        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
}
