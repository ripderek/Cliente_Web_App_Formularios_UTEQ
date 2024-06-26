import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PlusCircleIcon,
  AdjustmentsHorizontalIcon,
  ChartBarSquareIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
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
  Select,
  Option,
} from "@material-tailwind/react";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ExcelJS from "exceljs";

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
const TABLE_HEAD_Detalles = ["", "Nombres", "Correo Institucional", "Agregar"];
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState, useRef } from "react";
import { CrearParticipantes } from "@/pages/dashboard/Participantes";
import axios from "axios";
import { OpcionesParticipantes } from "@/pages/dashboard/FormulariosC";
const sidenavColors = {
  white: "border-gray-500",
  dark: "border-gray-600",
  green: "border-lime-600",
  orange: "border-orange-600",
  red: "border-red-600",
  pink: "border-pink-600",
};
/* PARA EL PDF  */
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
/** */
export default function Participantes({ idTest_id, Regresar, TituloTest }) {
  //Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("10");
  const itemsPorPag = value; // Numero de niveles a mostra por pagina

  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, sidenavColor } = controller;
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
        process.env.NEXT_PUBLIC_ACCESLINK + "test/ListaParticipantes",
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
        console.log(error);
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
  //abrir las opciones del participante
  const [abrirOpciones, setAbrirOpciones] = useState(false);
  const [id_Participante, setIdParticipante] = useState(0);
  const [ParticipanteName, setPartiicpanteName] = useState("");
  const abrir = (id) => {
    setIdParticipante(id);
    setAbrirOpciones(true);
  };
  const cerrar = () => {
    setAbrirOpciones(false);
    ObtenerListaParticipantes();
  };

  //Paginacion

  // Obtener el total de páginas
  const totalNiveles = ListaParticipantes.length;
  const totalPages = Math.ceil(totalNiveles / itemsPorPag);

  // Calcular el índice del primer y último formulario en la página actual
  const indexOfLastItem = currentPage * itemsPorPag;
  const indexOfFirstItem = indexOfLastItem - itemsPorPag;
  const currentItems = ListaParticipantes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
  //FUNCION PARA GENERAR EL PDF
  const ConvertirAPDF = useRef(null);
  const GenerarPDF = async () => {
    const data = ConvertirAPDF.current;
    try {
      const canvas = await html2canvas(data);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 6, 6, width, height);
      pdf.save("Resultado.pdf");
    } catch (error) {
      alert("Error al convertir el PDF");
      console.log(error);
    }
  };

  //PDF

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const generarPDF = () => {
    let contador = 1; // Inicializar contador
    const participantes = ListaParticipantes.map((participante) => [
      contador++,
      participante.r_nombres_apellidos,
      participante.r_correo_institucional,
      participante.r_supero_limite ? "Si" : "No",
      participante.r_fecha_add,
    ]);

    const docDefinition = {
      content: [
        { text: `${TituloTest}`, style: "test" },
        { text: "Lista de Participantes del test", style: "header" },
        { text: " ", style: "subheader" },
        {
          table: {
            headerRows: 1,
            //widths: ["auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                "Num",
                "Nombres y Apellidos",
                "Correo Institucional",
                "Superó Límite",
                "Fecha Agregado",
              ],
              ...participantes,
            ],
            layout: "noBorders", // Establecer el diseño de la tabla
            minCellHeight: 100, // Establecer la altura mínima de la celda
          },
        },
      ],
      styles: {
        test: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: "center",
        },
        subheader: {
          fontSize: 12,
          alignment: "center",
        },
      },
    };

    console.log("descargar pdf");
    pdfMake.createPdf(docDefinition).download("Reporte_Participantes.pdf");
  };

  //Exel

  const generarExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Participantes");

    // Definir las columnas de la tabla
    worksheet.columns = [
      { header: "Num", key: "num", width: 10 },
      { header: "Nombres y Apellidos", key: "nombresApellidos", width: 30 },
      { header: "Correo Institucional", key: "correoInstitucional", width: 30 },
      { header: "Superó Límite", key: "superoLimite", width: 15 },
      { header: "Fecha Agregado", key: "fechaAgregado", width: 20 },
    ];

    // Agregar datos de participantes
    ListaParticipantes.forEach((participante, index) => {
      worksheet.addRow({
        num: index + 1,
        nombresApellidos: participante.r_nombres_apellidos,
        correoInstitucional: participante.r_correo_institucional,
        superoLimite: participante.r_supero_limite ? "Si" : "No",
        fechaAgregado: participante.r_fecha_add,
      });
    });

    // Escribir el archivo Excel
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Reporte_Participantes.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error al generar el archivo Excel:", error);
      });
  };

  const [abrirReportes, setAbrirReportes] = useState(false);
  const handlerAbrirReportes = () => {
    setAbrirReportes(!abrirReportes);
  };

  return (
    <Card className="h-full w-full rounded-none" ref={ConvertirAPDF}>
      {abrirOpciones && (
        <OpcionesParticipantes
          cerrar={cerrar}
          id_participante={id_Participante}
          nombreParticipante={ParticipanteName}
        />
      )}

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
            <div className="overflow-y-auto h-96">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Numero de filas:{" "}
                <span className="font-bold">
                  {listaParticipantesCreados.length}
                </span>
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
                                onClick={() =>
                                  AgregarUserTest(r_id_participante)
                                }
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
            </div>
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
      <Dialog open={abrirReportes} size="xl">
        <DialogHeader> Reportes</DialogHeader>
        <DialogBody className="font-semibold w-full mx-auto text-center mt-4">
          {/*Detalles del test: {detallesTest.r_descripcion}*/}
          {/* */}
          <Tooltip content="PDF">
              <Button
                variant="outlined"
                size="sm"
                color="red"
                onClick={generarPDF}
              >
                <Avatar
                  src={"/Icons/PDFICON.png"}
                  alt="avatar"
                  size="sm"
                  className="flex cursor-pointer"
                />
              </Button>
            </Tooltip>
            <Tooltip content="Excel">
              <Button
                variant="outlined"
                size="sm"
                color="green"
                onClick={generarExcel}
              >
                <Avatar
                  src={"/Icons/ExcelICON.png"}
                  alt="avatar"
                  size="sm"
                  className="flex cursor-pointer"
                />
              </Button>
            </Tooltip>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="yellow"
            onClick={handlerAbrirReportes}
          >
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className=" flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="black">
              {TituloTest}
            </Typography>
            <Typography variant="h5" color="blue-gray">
              Lista de participantes
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Estos son los participantes en el test
            </Typography>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
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

            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              onClick={ObtenerListaParticipantes_creados}
            >
              <PlusCircleIcon strokeWidth={2} className="h-6 w-6" /> Agregar
              Participante
            </Button>
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="blue"

              onClick={handlerAbrirReportes}
            >
              <ChartBarSquareIcon strokeWidth={2} className="h-6 w-6" />{" "}
              Reportes
            </Button>
            <Tooltip content="Refrescar">
              <Button
                variant="gradient"
                size="sm"
                color="green"
                onClick={ObtenerListaParticipantes}
                className="flex items-center gap-3"
              >
                <ArrowPathIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0">
        {ListaParticipantes.length === 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Este test no contiene participantes
          </div>
        ) : (
          <>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              Numero de filas:
              <span className="font-bold">{ListaParticipantes.length}</span>
            </Typography>
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
                {currentItems.map(
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
                    const isLast = index === currentItems.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr
                        key={r_id_participante_test}
                        className="hover:bg-yellow-200 cursor-pointer"
                        onClick={() => (
                          setPartiicpanteName(r_nombres_apellidos),
                          abrir(r_id_participante_test)
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
                        {/* 
                      <td className={classes}>
                        <Tooltip content="Opciones">
                          <IconButton
                            variant="text"
                            onClick={() => (
                              setPartiicpanteName(r_nombres_apellidos),
                              abrir(r_id_participante_test)
                            )}
                          >
                            <AdjustmentsHorizontalIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                      */}
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
            <Option value={ListaParticipantes.length}>Todos</Option>
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
