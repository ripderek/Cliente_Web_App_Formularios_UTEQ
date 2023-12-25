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
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Cookies from "universal-cookie";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

export default function Crear({ abrir, cerrar, crear }) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen((cur) => !cur);
  const cookies = new Cookies();

  //estado para almacenar la info de la seccion
  const [seccion, setSeccion] = useState({
    p_Titulo: "",
    p_Descripcion: "",
    p_ID_User_crea: cookies.get("id_user"),
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
      //format(fechaHora, 'yyyy-MM-dd HH:mm:ssXXX')
      //const fechaHoraInicioFormateada = fechaHoraInicio.toISOString();
      const fechaHoraInicioFormateada = format(
        fechaHoraInicio,
        "yyyy-MM-dd HH:mm:ssXXX"
      );
      const fechaHoraCierreFormateada = format(
        fechaHoraCierre,
        "yyyy-MM-dd HH:mm:ssXXX"
      );
      //alert(fechaHoraInicioFormateada + "-" + fechaHoraCierreFormateada);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/Crear_Test",
        {
          p_Titulo: seccion.p_Titulo,
          p_Fecha_hora_cierre: fechaHoraCierreFormateada,
          p_Fecha_hora_inicio: fechaHoraInicioFormateada,
          p_ID_User_crea: seccion.p_ID_User_crea,
          p_Descripcion: seccion.p_Descripcion,
          p_Ingresos_Permitidos: 3,
        },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      crear(true);
      cerrar(false);
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
  ////////////////////////////////////////////////
  const [fechaHoraInicio, setFechaHoraInicio] = useState(new Date());
  const [fechaHoraCierre, setFechaHoraCierre] = useState(new Date());

  const enviarDatos = () => {
    // Formatear las fechas según el formato de PostgreSQL
    const fechaHoraInicioFormateada = fechaHoraInicio.toISOString();
    const fechaHoraCierreFormateada = fechaHoraCierre.toISOString();

    // Luego, puedes enviar las fechas formateadas al backend
    // (aquí asumimos que tienes una función para manejar la solicitud al servidor)
    alert(fechaHoraInicioFormateada + "-" + fechaHoraCierreFormateada);
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
              Crear formulario
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
              name="p_Titulo"
              onChange={HandleChange}
            />

            <Input
              label="Descripcion"
              size="lg"
              name="p_Descripcion"
              onChange={HandleChange}
            />
            {/* 
            <div className="-ml-2.5 -mt-3">
              <Checkbox label="Remember Me" />
            </div>
            */}
            <Typography
              className=" font-normal"
              variant="paragraph"
              color="gray"
            >
              Fecha y hora de Inicio:
            </Typography>
            <DateTimePicker
              className="w-auto cursor-pointer"
              onChange={setFechaHoraInicio}
              value={fechaHoraInicio}
            />
            <Typography
              className=" font-normal"
              variant="paragraph"
              color="gray"
            >
              Fecha y hora de Cierre:
            </Typography>
            <DateTimePicker
              className="w-auto cursor-pointer"
              onChange={setFechaHoraCierre}
              value={fechaHoraCierre}
            />
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
