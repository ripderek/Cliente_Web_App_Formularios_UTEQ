import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  TimelineHeader,
} from "@material-tailwind/react";
import {
  BellIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { ReportsParticipantes } from "@/Data/ReportsParticipantes";
import { ReportsSecciones } from "@/Data/ReportsSecciones";
import { ReportsProgreso } from "@/Data/ReportsProgreso";

const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import { Dialog_Error, Loader } from "@/widgets";

import { useState, useEffect } from "react";

import { generarPDF, generarExcel } from "@/Data/GenerarPDF_EXEL";

import axios from "axios";

export default function Search() {
  const [load, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [codigoTest, setCodigoTest] = useState("");
  //Variables para almacenar los indicadores para los reportes
  const [TieneParticipantes, setTieneParticipantes] = useState(false);
  const [TieneProgresoRespuestas, setTieneProgresoRespuestas] = useState(false);
  const [TieneSecciones, setTieneSecciones] = useState(false);

  //funcion para buscar en la bd
  const Obtener_Datos_Usuario = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/fu_posibilidades_reportes_formulario/" +
          codigoTest,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      setTieneParticipantes(data.resultado.TieneParticipantes);
      setTieneProgresoRespuestas(data.resultado.TieneProgresoRespuestas);
      setTieneSecciones(data.resultado.TieneSecciones);
      setLoader(false);
      console.log(ReportsParticipantes);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  const cerrar = () => {
    setError(false);
  };

  //const [ListaParticipantes, setListaParticipantes] = useState([]);

  //funcion para crear el reporte en la api
  const Obtener_Reporte = async (codigo, tipo) => {
    //setLoader(true);
    try {
        
      const response = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "reportes/Crear_Reporte",
        {
          codigoFormulario: codigoTest,
          codigoReporte: codigo,
          codigoTipo: tipo,
        },
        {
          withCredentials: true,
          responseType: "arraybuffer", // Indicar que la respuesta es un array de bytes
        }
      );

      console.log(response);
      // Crear un objeto Blob desde el buffer de bytes recibido
      const blob = new Blob([new Uint8Array(response.data)], { type: "application/pdf" });
      //const blob = new Blob([response.data], { type: "application/pdf" });

      // Crear una URL para el objeto Blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace para descargar el PDF
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Reporte.pdf");
      document.body.appendChild(link);

      // Simular un clic en el enlace para iniciar la descarga
      link.click();

      // Eliminar el enlace del DOM después de la descarga
      document.body.removeChild(link);

      //setLoader(false);
    } catch (error) {
      //setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      //alert(error);
      console.log(error);
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };

  return (
    <Card className="h-full w-full">
      {error && (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error Inicio de sesion"
          cerrar={cerrar}
        />
      )}
      {load && <Loader />}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Reportes
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Lista de reportes disponibles
            </Typography>
          </div>
          {/* 
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm">
              view all
            </Button>
            <Button className="flex items-center gap-3" size="sm">
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
            </Button>
          </div>
*/}
        </div>
        <div className="w-full  mb-8">
          <Input
            value={codigoTest}
            label="Codigo del formulario"
            icon={
              <MagnifyingGlassIcon
                className="h-5 w-5 cursor-pointer"
                onClick={Obtener_Datos_Usuario}
              />
            }
            onChange={(e) => setCodigoTest(e.target.value)}
          />
        </div>
        {/*
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
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
         */}
      </CardHeader>

      <div className=" px-0 mt-0 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
          {/*LISTA DE REPORTES SI TIENE PARTICIPANTES */}
          {TieneParticipantes === true && (
            <div key={1} className="shadow-xl rounded-md bg-blue-gray-200 ">
              <div className=" p-2">
                <Typography variant="h5" color="blue-gray">
                  Participantes
                </Typography>
                <Timeline className="mx-auto ">
                  <div className="grid grid-cols-2 gap-3 p-5">
                    {ReportsParticipantes.map(
                      ({ id, title, Codigo, TipoDoc }) => (
                        <TimelineItem className="h-auto   hover:border-4 hover:border-orange-600">
                          <TimelineConnector className="!w-[78px]" />
                          <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-blue-gray-50 py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                            {/*
                    <TimelineIcon className="p-3" variant="ghost">
                      <BellIcon className="h-5 w-5" />
                    </TimelineIcon>
 */}
                            <div className="flex flex-col gap-1">
                              <input
                                type="text"
                                value={title}
                                className="bg-blue-gray-50 font-bold w-11/12"
                                disabled
                              />

                              {/*
                               <Typography variant="h6" color="blue-gray">
                                {title}
                              </Typography>
                              <Typography
                                variant="small"
                                color="gray"
                                className="font-normal"
                              >
                                {Codigo}
                              </Typography> */}

                              {/*Mostrar los ICONOS DEL TIPO DE DOCUMENTO */}
                              <div className="flex items-end gap-1 mx-auto  ">
                                {TipoDoc.map((doc, index) => (
                                  <>
                                    {/*<span key={index}>{doc.tipo}</span>             src="/img/Home/uteq_logo3.png"*/}
                                    <Tooltip
                                      content={
                                        doc.tipo === "PDF" ? "PDF" : "EXCEL"
                                      }
                                    >
                                      <Avatar
                                        src={
                                          doc.tipo === "PDF"
                                            ? "/Icons/PDFICON.png"
                                            : "/Icons/EXCELICON.png"
                                        }
                                        alt="avatar"
                                        size="sm"
                                        className="flex cursor-pointer"
                                        onClick={() =>
                                          Obtener_Reporte(Codigo, doc.tipo)
                                        }
                                      />
                                    </Tooltip>
                                  </>
                                ))}
                              </div>
                            </div>
                          </TimelineHeader>
                        </TimelineItem>
                      )
                    )}
                  </div>
                </Timeline>
              </div>
            </div>
          )}
          {/*LISTA DE REPORTES SI TIENE Secciones */}
          {TieneSecciones === true && (
            <div key={2} className="shadow-xl rounded-md bg-blue-gray-200 ">
              <div className="p-2">
                <Typography variant="h5" color="blue-gray">
                  Secciones
                </Typography>
                <Timeline className="mx-auto  ">
                  <div className="grid grid-cols-2 gap-3 p-5">
                    {ReportsSecciones.map(({ id, title, Codigo, TipoDoc }) => (
                      <TimelineItem className="h-auto  hover:border-4 hover:border-orange-600">
                        <TimelineConnector className="!w-[78px]" />
                        <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-blue-gray-50 py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                          {/*
                    <TimelineIcon className="p-3" variant="ghost">
                      <BellIcon className="h-5 w-5" />
                    </TimelineIcon>
 */}
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              value={title}
                              className="bg-blue-gray-50 font-bold w-11/12"
                              disabled
                            />
                            {/* 
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            {Codigo}
                          </Typography>*/}
                            {/*Mostrar los ICONOS DEL TIPO DE DOCUMENTO */}
                            <div className="flex items-end gap-1 mx-auto">
                              {TipoDoc.map((doc, index) => (
                                <>
                                  {/*<span key={index}>{doc.tipo}</span>             src="/img/Home/uteq_logo3.png"*/}
                                  <Tooltip
                                    content={
                                      doc.tipo === "PDF" ? "PDF" : "EXCEL"
                                    }
                                  >
                                    <Avatar
                                      src={
                                        doc.tipo === "PDF"
                                          ? "/Icons/PDFICON.png"
                                          : "/Icons/EXCELICON.png"
                                      }
                                      alt="avatar"
                                      size="sm"
                                      className="flex cursor-pointer"
                                    />
                                  </Tooltip>
                                </>
                              ))}
                            </div>
                          </div>
                        </TimelineHeader>
                      </TimelineItem>
                    ))}
                  </div>
                </Timeline>
              </div>
            </div>
          )}
          {/*LISTA DE REPORTES SI TIENE Progreso */}
          {TieneProgresoRespuestas === true && (
            <div key={3} className="shadow-xl rounded-md bg-blue-gray-200 ">
              <div className="p-2">
                <Typography variant="h5" color="blue-gray">
                  Progreso
                </Typography>
                <Timeline className="mx-auto  ">
                  <div className="grid grid-cols-2 gap-3 p-5">
                    {ReportsProgreso.map(({ id, title, Codigo, TipoDoc }) => (
                      <TimelineItem className="h-auto  hover:border-4 hover:border-orange-600">
                        <TimelineConnector className="!w-[78px]" />
                        <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-blue-gray-50 py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                          {/*
                    <TimelineIcon className="p-3" variant="ghost">
                      <BellIcon className="h-5 w-5" />
                    </TimelineIcon>
 */}
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              value={title}
                              className="bg-blue-gray-50 font-bold w-11/12"
                              disabled
                            />
                            {/* 
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            {Codigo}
                          </Typography>*/}
                            {/*Mostrar los ICONOS DEL TIPO DE DOCUMENTO */}
                            <div className="flex items-end gap-1 mx-auto">
                              {TipoDoc.map((doc, index) => (
                                <>
                                  {/*<span key={index}>{doc.tipo}</span>             src="/img/Home/uteq_logo3.png"*/}
                                  <Tooltip
                                    content={
                                      doc.tipo === "PDF" ? "PDF" : "EXCEL"
                                    }
                                  >
                                    <Avatar
                                      src={
                                        doc.tipo === "PDF"
                                          ? "/Icons/PDFICON.png"
                                          : "/Icons/EXCELICON.png"
                                      }
                                      alt="avatar"
                                      size="sm"
                                      className="flex cursor-pointer"
                                    />
                                  </Tooltip>
                                </>
                              ))}
                            </div>
                          </div>
                        </TimelineHeader>
                      </TimelineItem>
                    ))}
                  </div>
                </Timeline>
              </div>
            </div>
          )}
        </div>
      </div>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
