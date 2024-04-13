import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  PlusCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
  PlusIcon,
  Bars3Icon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  TrashIcon,
  CogIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  PresentationChartBarIcon,
  UserIcon,
  Square3Stack3DIcon,
  TableCellsIcon,
  ArrowTrendingUpIcon,
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
  Alert,
} from "@material-tailwind/react";
import { Crear, Errores_Test } from "@/pages/dashboard/FormulariosC";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import Cookies from "universal-cookie";
const TABLE_HEAD = ["", "Titulo", "Estado", "Ingreso", /*"Suspenso",*/ "Obs"];
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
  //"Suspendido",
  "Ingresos permitidos",
  "Preguntas",
  "Acceso",
];
//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
const sidenavColors = {
  white: "border-gray-500",
  dark: "border-gray-600",
  green: "border-lime-600",
  orange: "border-orange-600",
  red: "border-red-600",
  pink: "border-pink-600",
};
const shadows = {
  white: "shadow-gray-500",
  dark: "shadow-gray-600",
  green: "shadow-lime-600",
  orange: "shadow-orange-600",
  red: "shadow-red-600",
  pink: "shadow-pink-600",
};
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import axios from "axios";
import { saveAs } from "file-saver";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

import { useEffect, useState } from "react";
export default function Lista({
  AbrirParticipantes,
  AbrirSecciones,
  AbrirEstadisticas,
  AbrirProgresos,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 5; // cantidad de formularios por página

  const [load, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
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
      pentanas_en_false();
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
    setError1(false);
  };
  const cerrar2 = () => {
    setError(false);
  };
  //ver detalles del test xd
  const [openDetalles, setOpenDetalles] = useState(false);
  const handleOpenDetalles = () => {
    setOpenDetalles(!openDetalles);
    Obtener_Secciones_Usuario();
  };
  //funcion para cargar el detalle del test
  const [detallesTest, setDetallesTest] = useState([]);
  const ObtnerDetallesTest = async (id) => {
    setIdTes(id);
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/TestDetalle/" + id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setDetallesTest(data);
      setOpenDetalles(true);
      //console.log(result.data);
      //Aqui crear una variable para que inserte los detalles a editar skere modo diablo
      SetDatosAEditar({
        ...DatosAEditar,
        Titulo: data.r_titulo_completo,
        Descripcion: data.r_descripcion,
        //Acceso: data.r_abierta,
        //GeneracionPreguntas: data.r_preguntas_aleatorias,
        Ingresos: data.r_ingresos_permitidos,
        ID_test: id,
      });
      //{ ...data_user, r_enunciado: e.target.value }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  // funcion para copiar el link del formulario en el cortapapeles
  const copiarTextoAlPortapapeles = (texto) => {
    // Crea un elemento de texto temporal
    const input = document.createElement("textarea");
    // Asigna el texto que deseas copiar al portapapeles
    input.value = texto;
    // Agrega el elemento al DOM
    document.body.appendChild(input);
    // Selecciona el texto en el elemento
    input.select();
    // Copia el texto al portapapeles
    document.execCommand("copy");
    // Remueve el elemento temporal
    document.body.removeChild(input);
    setOpenAlertTexto(true);
  };
  //estado para el alert de copiar texto
  const [openAlertTexto, setOpenAlertTexto] = useState(false);
  //funcion para eliminar el test skere modo diablo
  //EliminarTest
  const EliminarTest = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/EliminarTest/" + idTes,
        "",
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      //agregar_seccion();
      setOpenDetalles(false);
      setDeseaEliminar(false);
      Obtener_Secciones_Usuario();
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const GenerarExcel = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/Generate_Excel_TODOS/" +
          idTes,
        "",
        {
          withCredentials: true,
          responseType: "arraybuffer", // Indicar que la respuesta es un array de bytes
        }
      );
      setLoader(false);
      //agregar_seccion();
      //setOpenDetalles(false);
      //setDeseaEliminar(false);
      //Obtener_Secciones_Usuario();
      alert("Excel generado");
      const blob = new Blob([result.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "datos.xlsx");
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const [DeseaEliminar, setDeseaEliminar] = useState(false);
  /* FUNCIONES Y ESTADOS PARA PODER EDITAR LAS COSAS DEL TEST*/
  const [tabs, setTabs] = useState({
    EditarTitulo: false,
    EditarDescripcion: false,
    EditarIntentos: false,
    EditarFechaInicio: false,
    EditarFechaFin: false,
  });
  // Función para cambiar entre pestañas
  const cambiarPestañas = (nuevaPestaña) => {
    setTabs((prevTabs) => ({
      ...Object.fromEntries(
        Object.entries(prevTabs).map(([key]) => [key, false])
      ),
      [nuevaPestaña]: true,
    }));
    ResetearEdicion();
  };
  //poner todo en false
  const pentanas_en_false = () => {
    setTabs((prevTabs) => ({
      ...Object.fromEntries(
        Object.entries(prevTabs).map(([key]) => [key, false])
      ),
      //[nuevaPestaña]: true,
    }));
  };
  //guardar los datos a editar
  const [DatosAEditar, SetDatosAEditar] = useState({
    Titulo: "",
    Descripcion: "",
    Ingresos: "",
    GeneracionPreguntas: false,
    Acceso: false,
    ID_test: 0,
  });
  //funcion para guardar los cambios
  const EditarTest = async (cambiarPregunta, cambiarAcceso) => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    pentanas_en_false();
    console.log(DatosAEditar);
    try {
      //console.log(data_user);
      //data_user.r_enunciado
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/EditarTestNoFechas",
        {
          Titulo: DatosAEditar.Titulo,
          ID_test: DatosAEditar.ID_test,
          Descripcion: DatosAEditar.Descripcion,
          Ingresos: DatosAEditar.Ingresos,
          Acceso: cambiarAcceso,
          GeneracionPreguntas: cambiarPregunta,
        },

        {
          withCredentials: true,
        }
      );
      setLoader(false);
      ObtnerDetallesTest(idTes);
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
    }
  };
  //Funcion para resetar los valores cuando se da click en el boton de la basura
  const ResetearEdicion = () => {
    //alert("Resetear");
    SetDatosAEditar({
      ...DatosAEditar,
      Titulo: detallesTest.r_titulo_completo,
      Descripcion: detallesTest.r_descripcion,
      Acceso: detallesTest.r_abierta,
      GeneracionPreguntas: detallesTest.r_preguntas_aleatorias,
      Ingresos: detallesTest.r_ingresos_permitidos,
      ID_test: idTes,
    });
  };
  const CerrarEdicion = () => {
    ResetearEdicion();
    pentanas_en_false();
  };
  const ChangePregunta = () => {
    EditarTest(true);
  };

  const [fechaHoraInicio, setFechaHoraInicio] = useState(new Date());
  //Funcion para cambiar la fecha al test skere modo diablo
  //se envia un bolenado para saber si es fecha de inicio o fin
  const Editar_Fechas = async (accion) => {
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
      pentanas_en_false();

      //alert(fechaHoraInicioFormateada + "-" + fechaHoraCierreFormateada);
      console.log({
        p_fecha_hora_update: fechaHoraInicioFormateada,
        p_id_test: idTes,
        cual_fecha_editar: accion,
      });
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/editar_fechas_test",
        {
          p_fecha_hora_update: fechaHoraInicioFormateada,
          p_id_test: DatosAEditar.ID_test,
          cual_fecha_editar: accion,
        },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      ObtnerDetallesTest(idTes);

      //crear(true);
      // cerrar(false);
    } catch (error) {
      console.log(error);
      //alert("Error");
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };

  //Estado para el filtro de busqueda
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Restablecer la página actual cuando se realiza una búsqueda
  };

  // Obtén el total de formularios después de aplicar el filtro
  const filteredForms = secciones.filter((seccion) =>
    seccion.r_titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtén el total de páginas después de aplicar el filtro
  const totalForms = filteredForms.length;
  const totalPages = Math.ceil(totalForms / formsPerPage);

  // Calcula el índice del primer y último formulario en la página actual
  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);

  // Función para manejar el cambio a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Función para manejar el cambio a la siguiente página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Card className="h-full w-full  rounded-none">
      {load ? <Loader /> : ""}
      {error1 ? <Errores_Test cerrar={cerrar1} id_test={idTes} /> : ""}
      <Crear abrir={openCreate} cerrar={cerrar} crear={crear} />
      {/* Para visualizar los detalles del test y poder seleccionar secciones, niveles y participantes*/}
      <Dialog open={openDetalles} size="xl" handler={handleOpenDetalles}>
        {error ? (
          <Dialog_Error
            mensaje={mensajeError}
            titulo="Error al llenar el formulario"
            cerrar={cerrar2}
          />
        ) : (
          ""
        )}
        <Dialog open={DeseaEliminar}>
          <DialogHeader className="bg-green-50">Eliminar Test</DialogHeader>
          <DialogBody>
            ¿Esta seguro que desea eliminar el test? Esta acción no se puede
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
              onClick={() => EliminarTest()}
            >
              <span>Aceptar</span>
            </Button>
          </DialogFooter>
        </Dialog>
        <DialogBody className="font-semibold">
          {/*Detalles del test: {detallesTest.r_descripcion}  idTes*/}

          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={() => (handleOpenDetalles(false), CerrarEdicion())}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
          <div className="flex w-full flex-col gap-2">
            <Alert
              open={openAlertTexto}
              onClose={() => setOpenAlertTexto(false)}
              color="green"
            >
              Enlace copiado
            </Alert>
          </div>
          {/* Hacer una condicion para poder editar el titulo automaticamente xd skere */}
          <div className="font-bold text-black text-xl">
            {tabs.EditarTitulo ? (
              <>
                <div className="flex w-2/3">
                  <Input
                    value={DatosAEditar.Titulo}
                    variant="standard"
                    className="font-bold text-black text-xl"
                    onChange={(e) =>
                      SetDatosAEditar({
                        ...DatosAEditar,
                        Titulo: e.target.value,
                      })
                    }
                  />
                  <IconButton
                    variant="text"
                    onClick={() => EditarTest(false, false)}
                    color="green"
                  >
                    <CheckCircleIcon className="h-7 w-7" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    onClick={() => CerrarEdicion()}
                    color="red"
                  >
                    <TrashIcon className="h-7 w-7" />
                  </IconButton>
                </div>
              </>
            ) : (
              <>
                {DatosAEditar.Titulo}

                <IconButton
                  variant="text"
                  onClick={() => cambiarPestañas("EditarTitulo")}
                >
                  <PencilIcon className="h-6 w-6" />
                </IconButton>
              </>
            )}
          </div>
          {/* DESCRIPCION DEL TEST */}
          <div className="p-2">
            {tabs.EditarDescripcion ? (
              <>
                <div className="flex w-2/3">
                  <Input
                    value={DatosAEditar.Descripcion}
                    variant="standard"
                    className="font-bold text-black text-xl"
                    onChange={(e) =>
                      SetDatosAEditar({
                        ...DatosAEditar,
                        Descripcion: e.target.value,
                      })
                    }
                  />
                  <IconButton
                    variant="text"
                    onClick={() => EditarTest(false, false)}
                    color="green"
                  >
                    <CheckCircleIcon className="h-7 w-7" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    onClick={() => CerrarEdicion()}
                    color="red"
                  >
                    <TrashIcon className="h-7 w-7" />
                  </IconButton>
                </div>
              </>
            ) : (
              <>
                {DatosAEditar.Descripcion}

                <IconButton
                  variant="text"
                  onClick={() => cambiarPestañas("EditarDescripcion")}
                >
                  <PencilIcon className="h-6 w-6" />
                </IconButton>
              </>
            )}
          </div>
          <div className="bg-green-100 p-6 rounded-2xl  flex flex-col md:flex-row md:items-center">
            {detallesTest.r_error ? (
              <div>No puede compartir el enlace hasta que corrija el Test</div>
            ) : (
              <>
                <div className="md:w-2/3 mb-2 md:mb-0 ">
                  <div className="overflow-y-auto">
                    https://encuesta.uteq.edu.ec:8000/Forms/
                    {detallesTest.r_token}
                  </div>
                </div>
                <div
                  className="md:w-1/3"
                  onClick={() =>
                    copiarTextoAlPortapapeles(
                      "https://encuesta.uteq.edu.ec:8000/Forms/" +
                        detallesTest.r_token
                    )
                  }
                >
                  <div className="w-auto bg-white rounded-xl mx-auto  text-center cursor-pointer">
                    Copiar enlace
                    <IconButton variant="text" disabled>
                      <ClipboardIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="overflow-y-scroll h-96">
            {/* TABLA DETALLES DEL TEST  */}
            <div className="overflow-y-auto">
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
                <tbody>
                  <tr key={detallesTest.r_id_test}>
                    <td className={"p-4 border-b border-blue-gray-50"}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <div className="flex">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              Inicio:
                            </Typography>
                            {tabs.EditarFechaInicio ? (
                              <div className="flex  ml-0 mr-0 w-auto">
                                <DateTimePicker
                                  className="w-auto cursor-pointer z-50"
                                  onChange={setFechaHoraInicio}
                                  value={fechaHoraInicio}
                                  disableClock
                                />
                                <div className="flex">
                                  <IconButton
                                    variant="text"
                                    onClick={() => Editar_Fechas(true)}
                                    color="green"
                                    className="mx-1"
                                  >
                                    <CheckCircleIcon className="h-7 w-7" />
                                  </IconButton>
                                  <IconButton
                                    variant="text"
                                    onClick={() => CerrarEdicion()}
                                    color="red"
                                    className="mx-1"
                                  >
                                    <TrashIcon className="h-7 w-7" />
                                  </IconButton>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="">
                                  <Chip
                                    className="ml-2 cursor-pointer"
                                    variant="ghost"
                                    size="sm"
                                    color="green"
                                    value={detallesTest.r_fecha_incio}
                                    onClick={() =>
                                      cambiarPestañas("EditarFechaInicio")
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex mt-2 ">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              Fin:
                            </Typography>
                            {tabs.EditarFechaFin ? (
                              <div className="flex  ml-0 mr-0 w-auto">
                                <DateTimePicker
                                  className="w-auto cursor-pointer z-50"
                                  onChange={setFechaHoraInicio}
                                  value={fechaHoraInicio}
                                  disableClock
                                />
                                <div className="flex">
                                  <IconButton
                                    variant="text"
                                    onClick={() => Editar_Fechas(false)}
                                    color="green"
                                    className="mx-1"
                                  >
                                    <CheckCircleIcon className="h-7 w-7" />
                                  </IconButton>
                                  <IconButton
                                    variant="text"
                                    onClick={() => CerrarEdicion()}
                                    color="red"
                                    className="mx-1"
                                  >
                                    <TrashIcon className="h-7 w-7" />
                                  </IconButton>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="">
                                  <Chip
                                    className="ml-2 cursor-pointer"
                                    variant="ghost"
                                    size="sm"
                                    color="gray"
                                    value={detallesTest.r_fecha_fin}
                                    onClick={() =>
                                      cambiarPestañas("EditarFechaFin")
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className={"p-4 border-b border-blue-gray-50"}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={detallesTest.r_estado}
                          color={
                            detallesTest.r_estado === "Erroneo"
                              ? "red"
                              : "blue-gray"
                          }
                        />
                      </div>
                    </td>
                    {/* 
                    <td className={"p-4 border-b border-blue-gray-50"}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={detallesTest.r_suspendido ? "Si" : "No"}
                          color={
                            detallesTest.r_suspendido ? "red" : "blue-gray"
                          }
                        />
                      </div>
                    </td>
*/}

                    <td className={"p-4 border-b border-blue-gray-50 w-20"}>
                      {tabs.EditarIntentos ? (
                        <div className="flex  ml-0 mr-0 w-auto">
                          <Input
                            value={DatosAEditar.Ingresos}
                            type="number"
                            variant="standard"
                            className="font-bold text-black text-xl"
                            onChange={(e) =>
                              SetDatosAEditar({
                                ...DatosAEditar,
                                Ingresos: e.target.value,
                              })
                            }
                          />
                          <div className="flex">
                            <IconButton
                              variant="text"
                              onClick={() => EditarTest(false, false)}
                              color="green"
                              className="mx-1"
                            >
                              <CheckCircleIcon className="h-7 w-7" />
                            </IconButton>
                            <IconButton
                              variant="text"
                              onClick={() => CerrarEdicion()}
                              color="red"
                              className="mx-1"
                            >
                              <TrashIcon className="h-7 w-7" />
                            </IconButton>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-max border-4 border-orange-800 p-2">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={DatosAEditar.Ingresos}
                              color="amber"
                              className="cursor-pointer"
                              onClick={() => cambiarPestañas("EditarIntentos")}
                            />
                          </div>
                        </>
                      )}
                    </td>
                    <td className={"p-4 border-b border-blue-gray-50"}>
                      <div className="w-max border-4 border-orange-800 p-2">
                        <Chip
                          className="cursor-pointer"
                          variant="ghost"
                          size="sm"
                          value={
                            detallesTest.r_preguntas_aleatorias
                              ? "Aleatorio"
                              : "Secuencial"
                          }
                          color="amber"
                          onClick={() => EditarTest(true, false)}
                        />
                      </div>
                    </td>
                    <td className={"p-4 border-b border-blue-gray-50"}>
                      <div className="w-max border-4 border-orange-800 p-2">
                        <Chip
                          className="cursor-pointer"
                          variant="ghost"
                          size="sm"
                          value={
                            detallesTest.r_abierta ? "Todos" : "Restringido"
                          }
                          color="amber"
                          onClick={() => EditarTest(false, true)}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* OPCIONES PARA AGREGAR SECCIONES Y PARTICIPANTES */}
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Cog6ToothIcon className="h-8 mr-2" />
                        <span className="font-bold">Opciones básicas</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
              <div
                key={0}
                className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                onClick={() =>
                  AbrirParticipantes(idTes, detallesTest.r_titulo_completo)
                }
              >
                <div className="mx-auto">
                  <div className="text-center">
                    <UserIcon className="h-16 mx-auto" />
                  </div>
                  <div className="w-full p-4 text-center font-bold text-black text-xl">
                    <span>Participantes </span>
                  </div>
                  <div className="w-auto flex mb-3 ml-2">
                    <Chip
                      variant="ghost"
                      size="sm"
                      color="green"
                      value={"Actuales: " + detallesTest.r_numero_participantes}
                    />
                  </div>
                </div>
              </div>
              <div
                key={1}
                className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                onClick={() =>
                  AbrirSecciones(idTes, detallesTest.r_titulo_completo)
                }
              >
                <div className="mx-auto">
                  <div className="text-center">
                    <Square3Stack3DIcon className="h-16 mx-auto" />
                  </div>
                  <div className="w-full p-4 text-center font-bold text-black text-xl">
                    <span>Secciones </span>
                  </div>
                  <div className="w-auto flex mb-3 ml-2">
                    <Chip
                      variant="ghost"
                      size="sm"
                      color="green"
                      value={"Actuales: " + detallesTest.r_numero_secciones}
                    />
                  </div>
                </div>
              </div>
            </div>
            {detallesTest.r_tiene_progreso && (
              <>
                {/*OPCIONES DE ESTADISTICAS */}
                <table className="mt-4 w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <ChartBarIcon className="h-8 mr-2" />
                            <span>Estadisticas</span>
                          </div>
                          {/**<Button
                          variant="gradient"
                          color="orange"
                          onClick={() => AbrirEstadisticas(idTes)}
                        >
                          <span>Estadisticas por pregunta</span>
                        </Button> */}
                        </div>
                      </th>
                    </tr>
                  </thead>
                </table>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
                  <div
                    key={0}
                    className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                    onClick={() =>
                      AbrirEstadisticas(idTes, detallesTest.r_titulo_completo)
                    }
                  >
                    <div className="mx-auto">
                      <div className="text-center">
                        <PresentationChartBarIcon className="h-16 mx-auto" />
                      </div>
                      <div className="w-full p-4 text-center font-bold text-black text-xl">
                        <span>Por preguntas </span>
                      </div>
                    </div>
                  </div>
                  <div
                    key={1}
                    className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                    onClick={() => GenerarExcel()}
                  >
                    <div className="mx-auto">
                      <div className="text-center">
                        <TableCellsIcon className="h-16 mx-auto" />
                      </div>
                      <div className="w-full p-4 text-center font-bold text-black text-xl">
                        <span>Generar Excel </span>
                      </div>
                    </div>
                  </div>
                  <div
                    key={2}
                    className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                    onClick={() =>
                      AbrirProgresos(idTes, detallesTest.r_titulo_completo)
                    }
                  >
                    <div className="mx-auto">
                      <div className="text-center">
                        <ArrowTrendingUpIcon className="h-16 mx-auto" />
                      </div>
                      <div className="w-full p-4 text-center font-bold text-black text-xl">
                        <span>Progresos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* OPCIONES AVANZADAS SKERE MODO DIABLO */}
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <CogIcon className="h-8 mr-2" />
                        <span>Opciones Avanzadas</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
            </table>

            {/*OPCIONES DE ELIMINAR, EDITAR, SUSPENDER ETC */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
              <div
                key={0}
                className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
                onClick={() => setDeseaEliminar(true)}
              >
                <div className="mx-auto">
                  <div className="text-center">
                    <TrashIcon className="h-16 mx-auto" />
                  </div>
                  <div className="w-full p-4 text-center font-bold text-black text-xl">
                    <span>Eliminar </span>
                  </div>
                </div>
              </div>

              {/*
              <div
                key={2}
                className={`bg-blue-gray-50  shadow-2xl rounded-none cursor-pointer border-4 border-green-900 hover:border-orange-600  `}
              >
                <div className="mx-auto">
                  <div className="text-center">
                    <XCircleIcon className="h-16 mx-auto" />
                  </div>
                  <div className="w-full p-4 text-center font-bold text-black text-xl">
                    <span>Suspender </span>
                  </div>
                </div>
              </div>
 */}
            </div>
          </div>
        </DialogBody>
        {/* 
        <DialogFooter>
          <Button
            variant="gradient"
            color="yellow"
            onClick={handleOpenDetalles}
          >
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
        */}
      </Dialog>
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
              onChange={handleSearchTermChange}
              value={searchTerm}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {secciones.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Usted no tiene Formularios creados
          </div>
        ) : currentForms.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            No se ha encontrado el formulario
          </div>
        ) : (
          <>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              Numero de filas:
              <span className="font-bold">{totalForms}</span>
            </Typography>
            <div className="overflow-x-auto  h-96">
              <table className="mt-4 w-full min-w-max table-auto text-left overflow-x-auto">
                <thead className=" ">
                  <tr className="sticky top-0 z-10 bg-blue-gray-200">
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentForms.map(
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
                        r_abierta,
                      },
                      index
                    ) => {
                      // Calcula el índice del formulario en la lista total de formularios
                      const formIndex = indexOfFirstForm + index + 1;

                      const isLast = index === currentForms.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr
                          key={r_id_test}
                          className="hover:bg-orange-100 cursor-pointer"
                        >
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {indexOfFirstForm + index + 1}
                              </Typography>
                            </div>
                          </td>
                          <td
                            className={classes}
                            onClick={() => ObtnerDetallesTest(r_id_test)}
                          >
                            <div className="flex items-center gap-3 ">
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
                                color={
                                  r_estado === "Erroneo" ? "red" : "blue-gray"
                                }
                              />
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Tooltip
                                content={
                                  r_abierta
                                    ? "Cualquiera que tenga el enlace puede entrar"
                                    : "Solo los de la lista pueden ingresar"
                                }
                              >
                                <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={r_abierta ? "Todos" : "Restringido"}
                                  color={r_abierta ? "green" : "blue-gray"}
                                />
                              </Tooltip>
                            </div>
                          </td>
                          {/* 
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
*/}
                          {/* 
                      <td className={classes}>
                        <Tooltip content="Editar test">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    
                      <td className={classes}>
                        <Tooltip content="Detalles del test">
                          <IconButton
                            variant="text"
                            onClick={() => ObtnerDetallesTest(r_id_test)}
                          >
                            <Bars3Icon className="h-8 w-8" />
                          </IconButton>
                        </Tooltip>
                      </td>
                      */}
                          {r_error ? (
                            <td className={classes}>
                              <Tooltip content="El test contiene errores">
                                <IconButton
                                  variant="outlined"
                                  onClick={() => (
                                    setError1(true), setIdTes(r_id_test)
                                  )}
                                >
                                  <XCircleIcon
                                    color="red"
                                    className="h-8 w-8"
                                  />
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
            </div>
          </>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Página {currentPage} de {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm" onClick={handlePreviousPage}>
            Anterior
          </Button>
          <Button variant="outlined" size="sm" onClick={handleNextPage}>
            Siguiente
          </Button>
        </div>
      </CardFooter>
      <Notification mensaje="Test creado" abrir={openAlert} crear={crear} />
    </Card>
  );
}
