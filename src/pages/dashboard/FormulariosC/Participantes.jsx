import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  PlusCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
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
  "Editar",
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
const TABLE_HEAD_Detalles = ["", "Nombres", "Correo Institucional", "Agregar"];
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState } from "react";
import { CrearParticipantes } from "@/pages/dashboard/Participantes";
import axios from "axios";

export default function Participantes({ idTest_id, Regresar }) {
  //funcion para listar los participantes de un test mediante el id test
  const [load, setLoader] = useState(false);
  //estado para almacenar todos los niveles de una seccion
  const [ListaParticipantes, setListaParticipantes] = useState([]);

  useEffect(() => {
    ObtenerListaParticipantes();
  }, []);
  //funcion para cargar los niveles que tiene una seccion
  const ObtenerListaParticipantes = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/TestParticipantes/" +
          idTest_id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setListaParticipantes(data);
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
  //fucion y estado para abrir el dialog de anadir participantes donde se tiene que cargar la lista de participantes que no esten en el test
  const [abrirParticipantes, setAbrirParticipantes] = useState(false);
  const handlerAbrirPartipantes = () => {
    setAbrirParticipantes(!abrirParticipantes);
    ObtenerListaParticipantes();
  };
  //funcion para obtener la lista de participantes creados
  const [listaParticipantesCreados, setListPCreate] = useState([]);
  const ObtenerListaParticipantes_creados = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/ListaParticipantes/",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setListPCreate(data);
      //console.log(result.data);
      setLoader(false);
      handlerAbrirPartipantes();
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      //setError(true);
      //setMensajeError(error.response.data.error);
      console.log(error);
    }
  };
  //palabra clave para buscar
  const [palabraClave, setPalabraClave] = useState("");
  const ObtenerListaParticipantes_creados_buscar = async () => {
    setLoader(true);
    //primero verificar si el estado esta vacio para listar todos los participantes
    if (palabraClave.trim() === "") {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK + "test/ListaParticipantes/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setListPCreate(data);
        //console.log(result.data);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        //colocar una alerta de error cuando no se pueda inciar sesion
        //setError(true);
        //setMensajeError(error.response.data.error);
        console.log(error);
      }
    } else {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "test/ListaParticipantesBusqueda/" +
            palabraClave,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setListPCreate(data);
        console.log(data);
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
  //estado y funcion para crear participantes
  const [crear_participantes, SetCrearParticipantes] = useState(false);
  const cerrarCrear = (value) => {
    if (value) {
      ObtenerListaParticipantes_creados_buscar();
    }
    SetCrearParticipantes(false);
  };
  //crear la funcion para agregar al usuario
  //AgregarUserTest
  const AgregarUserTest = async (id_u) => {
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "participantes/Crear_Partipantes_Test",
        { p_id_participante: id_u, p_id_test: idTest_id },
        {
          withCredentials: true,
        }
      );
      //console.log(result.data);
      setLoader(false);
      setError(true);
      setMensajeError("Se agrego al usuario");
    } catch (error) {
      //console.log(error);
      setLoader(false);
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  const cerrar1 = (valor) => {
    setError(valor);
  };
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  return (
    <Card className="h-full w-full mt-5">
      {load ? <Loader /> : ""}
      {crear_participantes ? <CrearParticipantes cerrar={cerrarCrear} /> : ""}
      {error ? (
        <Dialog_Error mensaje={mensajeError} titulo="" cerrar={cerrar1} />
      ) : (
        ""
      )}
      <Dialog open={abrirParticipantes} size="xl">
        <DialogHeader> Agregar Participantes</DialogHeader>
        <DialogBody className="font-semibold">
          <div className="w-full">
            <Input
              label="Buscar"
              value={palabraClave}
              onChange={(e) => setPalabraClave(e.target.value)}
              icon={
                <MagnifyingGlassIcon
                  className="h-5 w-5"
                  onClick={() => ObtenerListaParticipantes_creados_buscar()}
                />
              }
            />
          </div>
          {/*Detalles del test: {detallesTest.r_descripcion}*/}
          {/* */}
          {listaParticipantesCreados.length === 0 ? (
            <div className="mx-auto text-center mt-4">
              <Button
                variant="gradient"
                color="orange"
                onClick={() => SetCrearParticipantes(true)}
              >
                <span>Crear Usuario</span>
              </Button>
            </div>
          ) : (
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
                {listaParticipantesCreados.map(
                  (
                    {
                      r_id_participante,
                      r_correo_institucional,
                      r_nombres_apellidos,
                      r_tipo_identificacion,
                      r_identificacion,
                      r_numero_celular,
                    },
                    index
                  ) => {
                    const isLast = index === ListaParticipantes.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={r_id_participante}>
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
                              {r_nombres_apellidos}
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
                              {r_correo_institucional}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Agregar al test">
                            <IconButton
                              variant="text"
                              onClick={() => AgregarUserTest(r_id_participante)}
                            >
                              <PlusCircleIcon
                                className="h-6 w-6"
                                color="green"
                              />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="yellow"
            onClick={handlerAbrirPartipantes}
          >
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de participantes
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Estos son los participantes en el test
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="outlined"
              size="sm"
              color="orange"
              onClick={Regresar}
            >
              Lista de Test
            </Button>
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              onClick={ObtenerListaParticipantes_creados}
            >
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Agregar
              Participante
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {ListaParticipantes.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Este test no contiene participantes
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
              {ListaParticipantes.map(
                (
                  {
                    r_id_participante_test,
                    r_fecha_add,
                    r_supero_limite,
                    r_estado_particpante,
                    r_id_participante,
                    r_correo_institucional,
                    r_nombres_apellidos,
                    r_tipo_identificacion,
                    r_identificacion,
                    r_numero_celular,
                  },
                  index
                ) => {
                  const isLast = index === ListaParticipantes.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={r_id_participante_test}>
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
                          {/* 
                    <Avatar src={img} alt={name} size="sm" />
                    */}
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {r_nombres_apellidos}
                            </Typography>
                            {/* 
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                      >
                        ""
                      </Typography>
                      */}
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {r_correo_institucional}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={r_supero_limite ? "Si" : "No"}
                            color={r_supero_limite ? "red" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {r_fecha_add}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Participante">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
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
          Paguina 1 de 10
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
    </Card>
  );
}
