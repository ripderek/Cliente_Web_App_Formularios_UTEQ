import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PlusCircleIcon,
  AdjustmentsHorizontalIcon,
  ChartBarSquareIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import {
  BarraNavegacion2,
  Navbar_app,
  Configurator,
} from "@/components/layout";
//rutas que va a tener la barra lateral
import routes from "@/routes";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavColor,
  setFixedNavbar,
  setSidenavType,
  setTransparentNavbar,
} from "@/context";
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

const TABS = [
  {
    label: "Activas",
    value: "Activas",
  },
  {
    label: "Inactivas",
    value: "Inactivas",
  },
  {
    label: "Incompletas",
    value: "Incompletas",
  },
  {
    label: "Completas",
    value: "Completas",
  },
];

const TABLE_HEAD = [
  "",
  "Nombres",
  "Correo Institucional",
  "Supero Limite",
  "Fecha Agregado",
];
//para ver las opciones de edicion de las preguntas ya sea para los datos o la respuesta
const TABLE_OPCIONES = [
  /*
  {
    name: "Editar pregunta",
    clave: "pregunta",
    id: 1,
  },*/
  {
    name: "Editar respuestas",
    clave: "respuesta",
    id: 2,
  },
];
//cabezera para la tabla de participantes
const TABLE_HEAD_Detalles = ["", "Nombres", "Correo Institucional", ""];
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import axios from "axios";
import { useState, useEffect } from "react";

export default function Lista({ cerrar, idSECCION, infoUser }) {
  //funcion en el useffect para obtener la lista de los usuarios que estan en el test
  const [load, setLoader] = useState(false);

  useEffect(() => {
    ObtenerListaParticipantes();
  }, []);
  const ObtenerListaParticipantes = async () => {
    setBusquedaActiva(false);
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "secciones/participantes_test_id_test/" +
          idSECCION,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setParticipantes(data);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      //setError(true);
      //setMensajeError(error.response.data.error);
      console.log(error);
    }
  };
  //Funcion para eliminar un usuario de una seccion skere modo diablo
  const EliminarNivel = async (idusuario) => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "secciones/eliminar_usuario_seccion",
        { p_id_seccion: idSECCION, p_id_usuario_invi: idusuario },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      ObtenerListaParticipantes();
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  const [particiantes, setParticipantes] = useState([]);
  //search_usuarios
  const [palabraClave, setPalabraClave] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const Busqueda = async () => {
    if (palabraClave.trim().length === 0) ObtenerListaParticipantes();
    else {
      setBusquedaActiva(true);
      setLoader(true);
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "secciones/search_usuarios/" +
            palabraClave,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setParticipantes(data);
        //console.log(result.data);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        //colocar una alerta de error cuando no se pueda inciar sesion
        //setError(true);
        //setMensajeError(error.response.data.error);
        console.log(error);
      }
    }
  };
  //funcion para agregar a un usuario a la seccion
  const AgregarUsuario = async (idusuario) => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "secciones/Invitado_Seccion",
        { p_id_seccion: idSECCION, p_id_usuario_invi: idusuario },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      ObtenerListaParticipantes();
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  return (
    <Dialog open={true} size="xl">
      {load && <Loader />}
      <DialogHeader>Participantes de la seccion</DialogHeader>
      <DialogBody className="font-semibold">
        {infoUser.isadmin && (
          <div className="w-full">
            <Input
              label="Buscar"
              value={palabraClave}
              onChange={(e) => setPalabraClave(e.target.value)}
              icon={
                <MagnifyingGlassIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => Busqueda()}
                />
              }
            />
          </div>
        )}

        {/*Detalles del test: {detallesTest.r_descripcion}*/}
        {/*Recorrer la lista de participantes de la seccion*/}

        <div className="overflow-y-auto h-96">
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal leading-none opacity-70 mt-2"
          >
            Numero de participantes:{" "}
            <span className="font-bold">{particiantes.length}</span>
          </Typography>
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD_Detalles.map((head) => (
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
            {/* listaParticipantesCreados */}
            <tbody>
              {particiantes.map(
                ({ toke_user, nombreuser, correo_user, isadmin }, index) => {
                  const isLast = index === particiantes.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={toke_user}>
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
                            {nombreuser}
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
                            {correo_user}
                          </Typography>
                        </div>
                      </td>
                      {busquedaActiva ? (
                        <td className={classes}>
                          {!isadmin && infoUser.isadmin && (
                            <Tooltip content="Eliminar">
                              <IconButton
                                variant="text"
                                onClick={() => AgregarUsuario(toke_user)}
                              >
                                <PlusCircleIcon
                                  className="h-6 w-6"
                                  color="green"
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </td>
                      ) : (
                        <td className={classes}>
                          {!isadmin && infoUser.isadmin && (
                            <Tooltip content="Eliminar">
                              <IconButton
                                variant="text"
                                onClick={() => EliminarNivel(toke_user)}
                              >
                                <TrashIcon className="h-6 w-6" color="red" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="gradient" color="yellow" onClick={cerrar}>
          <span>Cerrar</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
