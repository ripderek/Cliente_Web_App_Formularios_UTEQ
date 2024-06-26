import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  PlusCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  DocumentIcon,
  DocumentMinusIcon,
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  TrashIcon,
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
  Select,
  Option,
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
import axios from "axios";
import { ListaPregunta } from "../FormulariosC";

export default function ListaPreguntas({
  id_nivel,
  nivel,
  seccion,
  id_seccion,
  AbrirNiveles,
  AbrirPlantilla,
  AbrirEditor,
  //AbrirEditarMEMRZAR,
  //AbrirEditarSELCIMG,
  //AbrirEditarSELCCLA,
}) {
  // Añadir un estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("Activas");
  const [searchTerm, setSearchTerm] = useState("");
  //Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("10");
  const itemsPorPag = value; // Numero de niveles a mostra por pagina

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
    if (value === "respuesta") {
      switch (tipo_pregunta_editar) {
        case "LOCIMG":
          AbrirEditor("MEMRZAR", idPregunta, false);
          break;
        case "MULTIMG":
          AbrirEditor("SELCIMG", idPregunta, false);
          break;
        default:
          AbrirEditor(tipo_pregunta_editar, idPregunta, false);
      }
    }
    //si el valor es eliminar  eliminar
    else if (value === "eliminar") {
      setDeseaEliminar(true);
    }
  };
  const EliminarPregunta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/EliminarPregunta/" +
          idPregunta,
        "",
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      setDeseaEliminar(false);
      setOpenEditar(false);
      ObtenerPreguntas();
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  const [DeseaEliminar, setDeseaEliminar] = useState(false);
  //abrir la configuracion del nivel
  const [AbrirConfig, setAbrirConfig] = useState(false);
  const [DeseaEliminarNivel, setDeseaEliminarNivel] = useState(false);
  //Funcion para eliminar un nivel y sus preguntas
  const EliminarNivel = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/Eliminar_Nivel_and_edit_numbers_levels",
        { p_id_nivel: id_nivel, p_id_seccion: id_seccion },

        {
          withCredentials: true,
        }
      );
      setLoader(false);
      setDeseaEliminarNivel(false);
      AbrirNiveles(id_seccion, seccion);
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };

  // Función para manejar el cambio de pestaña
  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1); // Restablecer la página actual cuando se cambia de pestaña
  };

  // Obtener el total de secciones después de aplicar el filtro por pestañas y búsqueda
  const filtroPreguntas = preguntas.filter((preguntas) => {
    // Filtrar por pestaña
    let filterByTab = true;
    if (activeTab === "Activas") {
      filterByTab = preguntas.r_estado;
    } else if (activeTab === "Inactivas") {
      filterByTab = !preguntas.r_estado;
    } else if (activeTab === "Incompletas") {
      filterByTab = preguntas.r_error;
    } else if (activeTab === "Completas") {
      filterByTab = !preguntas.r_error;
    }

    // Filtrar por término de búsqueda
    const matchesSearchTerm = preguntas.r_enunciado
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Devolver true si cumple ambas condiciones
    return filterByTab && matchesSearchTerm;
  });

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Restablecer la página actual cuando se realiza una búsqueda
  };

  //Paginacion

  // Obtener el total de páginas
  const totalNiveles = filtroPreguntas.length;
  const totalPages = Math.ceil(totalNiveles / itemsPorPag);

  // Calcular el índice del primer y último formulario en la página actual
  const indexOfLastItem = currentPage * itemsPorPag;
  const indexOfFirstItem = indexOfLastItem - itemsPorPag;
  const currentItems = filtroPreguntas.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Card className="h-full w-full rounded-none">
      {load ? <Loader /> : ""}
      {/* Para eliminar una pregunta  */}
      <Dialog open={openEdtiar} handler={handleOpenEditar}>
        <Dialog open={DeseaEliminar}>
          <DialogHeader>Eliminar pregunta</DialogHeader>
          <DialogBody>
            ¿Esta seguro que desea eliminar la pregunta? Esta acción no se puede
            revertir
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setDeseaEliminar(false)}
              className="mr-1"
            >
              <span>Cancelar</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={() => EliminarPregunta()}
            >
              <span>Aceptar</span>
            </Button>
          </DialogFooter>
        </Dialog>
        <DialogHeader className="bg-green-50">
          <Typography variant="h4" color="blue-gray">
            Opciones Pregunta
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={handleOpenEditar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>

        <DialogBody>
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5">
              {/* EDITAR RESPUESTAS */}
              <div
                key={0}
                className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                onClick={() => editar("respuesta")}
              >
                <div className="mx-auto">
                  <div className="text-center mt-2 ">
                    <PencilSquareIcon
                      className="h-16 mx-auto bg-white w-auto rounded-xl"
                      color="green"
                    />
                  </div>
                  <div className="w-full p-4 text-center font-bold text-black text-xl">
                    <span>Editar </span>
                  </div>
                </div>
              </div>

              {/* Eliminar pregunta */}
              <div
                key={2}
                className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                onClick={() => editar("eliminar")}
              >
                <div className="mx-auto">
                  <div className="text-center mt-2 ">
                    <DocumentMinusIcon
                      className="h-16 mx-auto bg-white w-auto rounded-xl"
                      color="red"
                    />
                  </div>
                  <div className="w-full p-4 text-center font-bold text-black text-xl">
                    <span>Eliminar </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="bg-green-50">
          <Typography variant="h4" color="blue-gray">
            Tipos de preguntas
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={handleOpen}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <div>
            <table className=" w-full min-w-max table-auto text-left">
              <tbody>
                {tipospreguntas.map(({ r_id_maestro, r_titulo }, index) => {
                  const isLast = index === preguntas.length - 1;
                  const classes = isLast
                    ? "p-4 cursor-pointer"
                    : "p-4 cursor-pointer border-b border-blue-gray-50";

                  return (
                    <tr
                      key={r_id_maestro}
                      className="hover:bg-orange-100"
                      onClick={() =>
                        AbrirPlantilla(r_id_maestro, r_titulo, id_nivel)
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
        </DialogBody>
        <DialogFooter>
          {/* 
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Aceptar</span>
          </Button>
          */}
        </DialogFooter>
      </Dialog>
      {/* DIALOG PARA ABRIR LA CONFIGURACION DEL NIVEL  */}
      <Dialog open={AbrirConfig} handler={() => setAbrirConfig(false)}>
        <Dialog open={DeseaEliminarNivel}>
          <DialogHeader>Eliminar nivel</DialogHeader>
          <DialogBody>
            ¿Esta seguro que desea eliminar el nivel? Esta acción no se puede
            revertir
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setDeseaEliminarNivel(false)}
              className="mr-1"
            >
              <span>Cancelar</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={() => EliminarNivel()}
            >
              <span>Aceptar</span>
            </Button>
          </DialogFooter>
        </Dialog>

        <DialogHeader className="bg-green-50">
          <Typography variant="h4" color="blue-gray">
            Configuracion
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={() => setAbrirConfig(false)}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>

        <DialogBody>
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5">
              {/* Eliminar nivel */}
              <div
                key={2}
                className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                onClick={() => setDeseaEliminarNivel(true)}
              >
                <div className="mx-auto">
                  <div className="text-center mt-2 ">
                    <TrashIcon
                      className="h-16 mx-auto bg-white w-auto rounded-xl"
                      color="red"
                    />
                  </div>
                  <div className="w-full p-4 text-center font-bold text-black text-xl">
                    <span>Eliminar Nivel </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter></DialogFooter>
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
            <Tooltip content="Regresar">
              <Button
                variant="outlined"
                size="sm"
                color="orange"
                onClick={() => AbrirNiveles(id_seccion, seccion)}
              >
                <ArrowLeftOnRectangleIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </Tooltip>
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              //onClick={() => (handleOpen(), ObtenerTiposPReguntas())}
              onClick={() => AbrirPlantilla(1, "", id_nivel)}
            >
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Crear
              Pregunta
            </Button>
            <Tooltip content="Configuracion">
              <Button
                className="flex items-center gap-3"
                size="sm"
                color="red"
                onClick={() => setAbrirConfig(true)}
                //onClick={() => (handleOpen(), ObtenerTiposPReguntas())}
                //onClick={() => AbrirPlantilla(1, "", id_nivel)}
              >
                <Cog6ToothIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={activeTab} className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => handleTabChange(value)}
                >
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              label="Buscar pregunta"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              onChange={handleSearchTermChange}
              value={searchTerm}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0">
        {preguntas.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Este nivel no tiene preguntas
          </div>
        ) : (
          <>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              Numero de preguntas:
              <span className="font-bold">{preguntas.length}</span>
            </Typography>
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
                {currentItems.map(
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
                      <tr
                        key={r_id_p}
                        className="hover:bg-orange-100 cursor-pointer"
                        onClick={() => (
                          setOpenEditar(true),
                          setTipoPreguntaEDitar(r_id_pregunta),
                          setIDPregunta(r_id_p)
                        )}
                      >
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {indexOfFirstItem + index + 1}
                            </Typography>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3 ">
                            {/* 
                          <Avatar src={img} alt={name} size="sm" />
                          */}
                            <div className="flex flex-col ">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {r_enunciado.substring(0, 25)}
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
          </>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Pagina {currentPage} de {totalPages}
        </Typography>
        <div className="flex">
          <Select
            label="N° Participantes"
            value={value}
            onChange={(val) => setValue(val)}
          >
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value={preguntas.length}>Todos</Option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm" onClick={handlePreviousPage}>
            Anterior
          </Button>
          <Button variant="outlined" size="sm" onClick={handleNextPage}>
            Siguiente
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
