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
  "Enunciado",
  "Tipo Pregunta",
  "Estado",
  "Fecha Creacion",
  "",
  "Obs",
];
//para ver las opciones de edicion de las preguntas ya sea para los datos o la respuesta
const TABLE_HEAD_1 = ["", "Tipo"];
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
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState } from "react";
export default function ListaPreguntas({
  id_nivel,
  nivel,
  seccion,
  id_seccion,
  AbrirNiveles,
  AbrirPlantilla,
  AbrirEditarMEMRZAR,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [load, setLoader] = useState(false);
  //estado para almacenar todos los niveles de una seccion
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    ObtenerPreguntas();
  }, []);
  //funcion para cargar los niveles que tiene una seccion
  const ObtenerPreguntas = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/Preguntas_nivel/" +
          id_nivel,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setPreguntas(data);
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
  //funcion para obtener la lista de los maestros de tipos de preguntas
  const [tipospreguntas, setTiposPreguntas] = useState([]);

  const ObtenerTiposPReguntas = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/Tipos_preguntas_maestras",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setTiposPreguntas(data);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //funcion para abrir el dialogo de editar entre pregunta o las respuestas.
  const [openEdtiar, setOpenEditar] = useState(false);
  const handleOpenEditar = () => setOpenEditar(!openEdtiar);
  //datos de la ecicon primero obtener el tipo de pregunta
  const [tipo_pregunta_editar, setTipoPreguntaEDitar] = useState("");
  //el tipo de edicion ya sea de pregunta o respuestas
  const [tipoEdicion, setTipoEdicion] = useState();
  const [idPregunta, setIDPregunta] = useState(0);
  //AbrirEditarMEMRZAR
  const editar = (value) => {
    if (value === "respuesta") AbrirEditarMEMRZAR(idPregunta, false);
  };
  return (
    <Card className="h-full w-full mt-5">
      {load ? <Loader /> : ""}
      {/* Para editar una pregunta  */}
      <Dialog open={openEdtiar} handler={handleOpenEditar}>
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Tipos de editar
          </Typography>
          <div>
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    ></Typography>
                  </th>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Tipo edicion
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_OPCIONES.map(({ name, id, clave }, index) => {
                  const isLast = index === preguntas.length - 1;
                  const classes = isLast
                    ? "p-4 cursor-pointer"
                    : "p-4 cursor-pointer border-b border-blue-gray-50";

                  return (
                    <tr key={id} onClick={() => editar(clave)}>
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
                            <Tooltip content="Seleccionar Opcion">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {name}
                              </Typography>
                            </Tooltip>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={handleOpenEditar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
      <Dialog open={open} handler={handleOpen}>
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Tipos de preguntas
          </Typography>
          <div>
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD_1.map((head) => (
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
                {tipospreguntas.map(({ r_id_maestro, r_titulo }, index) => {
                  const isLast = index === preguntas.length - 1;
                  const classes = isLast
                    ? "p-4 cursor-pointer"
                    : "p-4 cursor-pointer border-b border-blue-gray-50";

                  return (
                    <tr
                      key={r_id_maestro}
                      onClick={() =>
                        AbrirPlantilla(true, r_id_maestro, r_titulo, id_nivel)
                      }
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
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Tooltip content="Seleccionar Opcion">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_titulo}
                              </Typography>
                            </Tooltip>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={handleOpen}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogBody>
        <DialogFooter>
          {/* 
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Aceptar</span>
          </Button>
          */}
        </DialogFooter>
      </Dialog>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de preguntas
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Lista de preguntas del {nivel} de la seccion {seccion}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="outlined"
              size="sm"
              color="orange"
              onClick={() => AbrirNiveles(true, id_seccion, seccion)}
            >
              Ver niveles
            </Button>
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              onClick={() => (handleOpen(), ObtenerTiposPReguntas())}
            >
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Crear
              Pregunta
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
              label="Buscar pregunta"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {preguntas.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Este nivel no tiene preguntas
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
              {preguntas.map(
                (
                  {
                    r_enunciado,
                    r_fecha,
                    r_tiempo_segundos,
                    r_estado,
                    r_id_pregunta,
                    r_id_p,
                    r_error,
                    r_error_detalle,
                  },
                  index
                ) => {
                  const isLast = index === preguntas.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={r_id_pregunta}>
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
                              {r_enunciado}
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
                            {r_id_pregunta}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={r_estado ? "Activo" : "Inactivo"}
                            color={r_estado ? "green" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {r_fecha}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Pregunta">
                          <IconButton
                            variant="text"
                            onClick={() => (
                              setOpenEditar(true),
                              setTipoPreguntaEDitar(r_id_pregunta),
                              setIDPregunta(r_id_p)
                            )}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
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
