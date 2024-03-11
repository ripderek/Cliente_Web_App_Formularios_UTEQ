import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
const TABLE_HEAD = ["", "Correo", "Nombres y Apellidos", "Progresos"];

//cabezera para la tabla de detalles

//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import { useEffect, useState } from "react";
export default function ListaProgreso({
  AbrirParticipantes,
  AbrirSecciones,
  AbrirEstadisticas,
  //este se necesita
  idTest_id,
  Regresar,
  TituloTest,
}) {
  const [load, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const crear = (value) => {
    setOpenAlert(value);
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
          "test/ListaProgresoParticipantesCompleto/" +
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

  return (
    <Card className="h-full w-full rounded-none">
      {load ? <Loader /> : ""}

      {/* Para visualizar los detalles del test y poder seleccionar secciones, niveles y participantes*/}

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="black">
              {TituloTest}
            </Typography>
            <Typography variant="h5" color="blue-gray">
              Lista de progresos
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Progresos de los participantes
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
            <Tooltip content="Refrescar">
              <Button
                variant="gradient"
                size="sm"
                color="green"
                onClick={Obtener_Secciones_Usuario}
              >
                <ArrowPathIcon strokeWidth={2} className="h-6 w-6" />
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
          <>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              Numero de filas:{" "}
              <span className="font-bold">{secciones.length}</span>
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
                {secciones.map(
                  ({ correo, nombre, porcentaje, progresos }, index) => {
                    const isLast = index === secciones.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr
                        key={correo}
                        className="hover:bg-yellow-300 "
                        //onClick={() => OpenA(r_id_pregunta, r_enunciado)}
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
                              {correo}
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
                              {nombre}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className=" text-center">
                            <Chip
                              value={porcentaje + "%"}
                              color={
                                porcentaje === 0
                                  ? "red"
                                  : porcentaje < 50
                                  ? "yellow"
                                  : porcentaje === 100
                                  ? "green"
                                  : "orange"
                              }
                            />
                          </div>
                          {progresos.map(({ Nombre, Porcentaje }) => (
                            <div className="flex">
                              <div className="font-bold">{Nombre + " "}</div> :{" "}
                              <div className=" text-right">
                                {" " + Porcentaje + "%"}
                              </div>
                            </div>
                          ))}
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
                  }
                )}
              </tbody>
            </table>
          </>
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
