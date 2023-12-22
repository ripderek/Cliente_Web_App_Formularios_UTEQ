import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  PlusIcon,
  ArrowRightCircleIcon,
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
} from "@material-tailwind/react";
import { CrearSeccion } from "@/pages/dashboard/OpcionesSecciones";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import { useEffect, useState } from "react";
export default function CrearPregunta({
  id_tipo,
  titulo_tipo,
  id_niv,
  AbrirMEMRZAR,
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
        process.env.NEXT_PUBLIC_ACCESLINK + "preguntas/Plantillas/" + id_tipo,
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
  return (
    <Card className="h-full w-full mt-4">
      {load ? <Loader /> : ""}
      <CrearSeccion abrir={openCreate} cerrar={cerrar} crear={crear} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Plantillas
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Lista de plantillas para {titulo_tipo}
            </Typography>
          </div>
          {/* 
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            
            <Button variant="outlined" size="sm">
              Todo
            </Button>
            
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              onClick={() => setOpenCreate(true)}
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Seccion
            </Button>
            
          </div>
          */}
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
              label="Buscar"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
        */}
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
          {secciones.map(
            ({
              r_id_tipo_pregunta,
              r_titulo,
              r_descripcion,
              r_icono,
              r_codigo,
            }) => (
              <div
                key={r_id_tipo_pregunta}
                className="bg-yellow-100 shadow-2xl rounded-2xl"
              >
                <div className="bg-zinc-900 text-black  rounded-2xl">
                  <div className="mx-auto">
                    <div className="text-center">
                      {/*src={
                                      process.env.NEXT_PUBLIC_ACCESLINK +
                                      "area/Areaimagen/" +
                                      area_id
                                    } */}
                      <img
                        src={
                          process.env.NEXT_PUBLIC_ACCESLINK +
                          "preguntas/Icono/" +
                          r_icono
                        }
                        alt={r_titulo}
                        className="mt-3 h-52 w-auto mx-auto"
                      />
                    </div>
                    <div className="w-full p-4">
                      <input
                        className="w-full text-lg bg-yellow-100 font-semibold	text-blue-gray-800 "
                        disabled
                        value={r_titulo}
                      />
                    </div>
                    <div className="m-4 text-blue-gray-800">
                      {r_descripcion}
                    </div>
                    <div className="p-2 flex justify-end">
                      <Tooltip content="Crear pregunta con esta plantilla">
                        <button
                          className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer font-bold text-white"
                          onClick={() =>
                            AbrirMEMRZAR(r_id_tipo_pregunta, r_icono)
                          }
                        >
                          {/*  <ArrowRightCircleIcon className="w-7" color="white" />*/}
                          Utilizar
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
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
      <Notification mensaje="Seccion creada" abrir={openAlert} crear={crear} />
    </Card>
  );
}
