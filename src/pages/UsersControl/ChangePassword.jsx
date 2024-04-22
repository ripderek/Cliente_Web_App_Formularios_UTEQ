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

export default function ChangePassword({ cerrarEdicion }) {
  const [infoUser, setInfoUser] = useState({
    firstPassword: "",
    SecondPassword: "",
  });
  const [load, setLoader] = useState(false);
  const cookies = new Cookies();

  const handleChange = (e) => {
    setInfoUser({ ...infoUser, [e.target.name]: e.target.value });
  };
  //funcion para actualizar la informacion del usuario
  const ActualizarInformacionUsuario = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);

    try {
      if (infoUser.firstPassword !== infoUser.SecondPassword) {
        setLoader(false);
        setMensajeError("Las contraseñas no coindicen");
        //alert(error.response.data.error);
        setError(true);
      } else {
        //Actualizar la contrasena

        const result = await axios.post(
          process.env.NEXT_PUBLIC_ACCESLINK + "users/sp_editar_contrasena",
          {
            p_nueva_contraseña: infoUser.firstPassword,
            p_id_usuario: cookies.get("id_user"),
          },
          {
            withCredentials: true,
          }
        );
        setLoader(false);
        //agregar_seccion();
        cerrarEdicion();
      }
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
              label="Nueva Contraseña"
              size="lg"
              name="firstPassword"
              value={infoUser.firstPassword}
              onChange={handleChange}
              type="password"
            />
            <Input
              label="Repita la nueva contraseña"
              size="lg"
              name="SecondPassword"
              value={infoUser.SecondPassword}
              onChange={handleChange}
              type="password"
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
