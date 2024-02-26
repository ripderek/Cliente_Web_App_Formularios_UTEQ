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
  Alert,
} from "@material-tailwind/react";
import { Crear, Errores_Test } from "@/pages/dashboard/FormulariosC";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { EstadisticaPregunta } from "@/pages/dashboard/Estadisticas";
import Cookies from "universal-cookie";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
const TABLE_HEAD = ["", "Enunciado"];
const TABS = [
  {
    label: "Todo",
    value: "Todo",
  },
  {
    label: "Habilitados",
    value: "Habilitados",
  },
  {
    label: "Inhabilitados",
    value: "Inhabilitados",
  },
  {
    label: "Suspendidos",
    value: "Suspendidos",
  },
];
//cabezera para la tabla de detalles
const TABLE_HEAD_Detalles = [
  "Fechas",
  "Estado Actual",
  "Suspendido",
  "Ingresos permitidos",
];
//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import { useEffect, useState } from "react";
export default function ListaPregunta({
  AbrirParticipantes,
  AbrirSecciones,
  AbrirEstadisticas,
  //este se necesita
  idTest_id,
  Regresar,
}) {
  const [load, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const crear = (value) => {
    setOpenAlert(value);
  };

  //estado para abrir el modal para crear una seccion
  const [openCreate, setOpenCreate] = useState(false);
  const cerrar = (value) => {
    setOpenCreate(value);
    Obtener_Secciones_Usuario();
  };
  //estado para almacenar todas las secciones del usuario
  const [secciones, setSecciones] = useState([]);
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  //funcion para cargar las secciones que tiene el usuario obteniendo su id de la cookie
  const Obtener_Secciones_Usuario = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/PreguntasFormularios/" +
          idTest_id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSecciones(data);
      setLoader(false);
      console.log(data);
    } catch (error) {
      console.log(error);
      setLoader(false);
      alert("Error aqui");
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  const [error1, setError1] = useState(false);
  const [idTes, setIdTes] = useState(0);
  const cerrar1 = (valor) => {
    setError1(valor);
  };
  //ver detalles del test xd
  const [openDetalles, setOpenDetalles] = useState(false);
  const handleOpenDetalles = () => {
    setOpenDetalles(!openDetalles);
  };

  const [EstadistricaPreun, setEstadispre] = useState(false);
  const CerrarEsata = () => {
    setEstadispre(false);
  };
  //estado para el alert de copiar texto
  const [openAlertTexto, setOpenAlertTexto] = useState(false);
  const [IdPre, setIdPre] = useState(0);
  const OpenA = (r_id_pregunta, pregunta) => {
    setIdPre(r_id_pregunta);
    setEstadispre(true);
    setpre(pregunta);
  };
  const [pre, setpre] = useState("");
  return (
    <Card className="h-full w-full rounded-none">
      {load ? <Loader /> : ""}
      {/* HACER UNO PARA VER  */}
      {EstadistricaPreun && (
        <EstadisticaPregunta
          openA={EstadistricaPreun}
          cerrar={CerrarEsata}
          idPregunta={IdPre}
          idTest={idTest_id}
          pregunta={pre}
        />
      )}

      {/* Para visualizar los detalles del test y poder seleccionar secciones, niveles y participantes*/}

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de preguntas
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Seleccione una para ver su rendimiento
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {/* 
            <Button variant="outlined" size="sm">
              Todo
            </Button>
            */}

            <Tooltip content="Regresar">
              <Button
                variant="outlined"
                size="sm"
                color="orange"
                onClick={Regresar}
              >
                <ArrowLeftOnRectangleIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0">
        {secciones.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Usted no tiene Formularios creados
          </div>
        ) : (
          <table className=" w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {secciones.map(({ r_id_pregunta, r_enunciado }, index) => {
                const isLast = index === secciones.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr
                    key={r_id_pregunta}
                    className="hover:bg-yellow-300 cursor-pointer"
                    onClick={() => OpenA(r_id_pregunta, r_enunciado)}
                  >
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {r_enunciado}
                        </Typography>
                      </div>
                    </td>
                    {/*
                      
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {r_fecha}
                        </Typography>
                      </td>
                      
                      {r_error ? (
                        <td className={classes}>
                          <Tooltip content={r_error_detalle}>
                            <IconButton variant="outlined">
                              <XCircleIcon color="red" className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      ) : (
                        <td className={classes}>
                          <IconButton variant="outlined">
                            <CheckCircleIcon
                              color="green"
                              className="h-4 w-4"
                            />
                          </IconButton>
                        </td> 
                      )}
                      */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Pagina 1 de 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Anterior
          </Button>
          <Button variant="outlined" size="sm">
            Siguiente
          </Button>
        </div>
      </CardFooter>
      <Notification mensaje="Test creado" abrir={openAlert} crear={crear} />
    </Card>
  );
}
