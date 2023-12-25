import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  PlusCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  PlusIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
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
} from "@material-tailwind/react";
import { Crear, Errores_Test } from "@/pages/dashboard/FormulariosC";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

import Cookies from "universal-cookie";
const TABLE_HEAD = [
  "",
  "Titulo",
  "Estado",
  "Suspenso",
  "Editar",
  "Detalles",
  "Obs",
];
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

//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import { useEffect, useState } from "react";
export default function Lista({ AbrirNiveles }) {
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
  const cookies = new Cookies();
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  //funcion para cargar las secciones que tiene el usuario obteniendo su id de la cookie
  const Obtener_Secciones_Usuario = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/TestUsuario/" +
          cookies.get("id_user"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSecciones(data);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
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
  return (
    <Card className="h-full w-full mt-4">
      {load ? <Loader /> : ""}
      {error1 ? <Errores_Test cerrar={cerrar1} id_test={idTes} /> : ""}
      <Crear abrir={openCreate} cerrar={cerrar} crear={crear} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de formularios
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Formularios que ha creado
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {/* 
            <Button variant="outlined" size="sm">
              Todo
            </Button>
            */}
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              onClick={() => setOpenCreate(true)}
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Crear formulario
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              label="Buscar"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {secciones.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Usted no tiene Formularios creados
          </div>
        ) : (
          <table className="mt-4 w-full min-w-max table-auto text-left">
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
              {secciones.map(
                (
                  {
                    r_id_test,
                    r_titulo,
                    r_fecha_incio,
                    r_fecha_fin,
                    r_estado,
                    r_suspendido,
                    r_descripcion,
                    r_ingresos_permitidos,
                    r_token,
                    r_error,
                  },
                  index
                ) => {
                  const isLast = index === secciones.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={r_id_test}>
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
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {r_titulo}
                            </Typography>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                <span className="font-bold">Inicio:</span>{" "}
                                {r_fecha_incio}
                              </Typography>
                            </div>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                <span className="font-bold">Fin:</span>{" "}
                                {r_fecha_fin}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={r_estado}
                            color={r_estado === "Erroneo" ? "red" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={r_suspendido ? "Si" : "No"}
                            color={r_suspendido ? "red" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar test">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Detalles del test">
                          <IconButton variant="text">
                            <Bars3Icon className="h-8 w-8" />
                          </IconButton>
                        </Tooltip>
                      </td>
                      {r_error ? (
                        <td className={classes}>
                          <Tooltip content="El test contiene errores">
                            <IconButton
                              variant="outlined"
                              onClick={() => (
                                setError1(true), setIdTes(r_id_test)
                              )}
                            >
                              <XCircleIcon color="red" className="h-8 w-8" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      ) : (
                        <td className={classes}>
                          <IconButton variant="outlined">
                            <CheckCircleIcon
                              color="green"
                              className="h-8 w-8"
                            />
                          </IconButton>
                        </td>
                      )}
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
                }
              )}
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
