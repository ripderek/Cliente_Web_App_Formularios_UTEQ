import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  PlusIcon,
  ArrowRightCircleIcon,
  EyeSlashIcon,
  EyeIcon,
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

import Cookies from "universal-cookie";

const TABS = [
  {
    label: "Todo",
    value: "Todo",
  },
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Miembro",
    value: "Miembro",
  },
];

//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import { useEffect, useState } from "react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export default function Lista({ AbrirNiveles }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const formsPerPage = 6; // Cantidad de secciones por página

  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
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
          "secciones/Secciones_Usuario/" +
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
  const sidenavTypes = {
    dark: "bg-green-900 ",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
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

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Restablecer la página actual cuando se realiza una búsqueda
  };

  // Obtener el total de secciones después de aplicar el filtro
  const filteredSections = secciones.filter((seccion) =>
    seccion.r_titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener el total de páginas después de aplicar el filtro de búsqueda
  const totalSections = filteredSections.length;
  const totalPages = Math.ceil(totalSections / formsPerPage);

  // Calcular el índice del primer y último formulario en la página actual
  const indexOfLastSection = currentPage * formsPerPage;
  const indexOfFirstSection = indexOfLastSection - formsPerPage;
  const currentSections = filteredSections.slice(
    indexOfFirstSection,
    indexOfLastSection
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

  return (
    <Card className="h-full w-full  rounded-none">
      {load ? <Loader /> : ""}
      <CrearSeccion abrir={openCreate} cerrar={cerrar} crear={crear} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de secciones
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Secciones a las que pertenece
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
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Seccion
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
      <CardBody className=" px-0">
        {secciones.length === 0 ? (
          <Typography
            color="gray"
            variant="h4"
            className="mt-1 font-normal mx-auto items-center text-center"
          >
            Usted no se encuentra en ninguna sección
          </Typography>
        ) : (
          currentSections.length === 0 && (
            <Typography
              color="gray"
              variant="h4"
              className="mt-1 font-normal mx-auto items-center text-center"
            >
              No se ha encontrado la sección
            </Typography>
          )
        )}

        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 ml-5"
        >
          Número de secciones:
          <span className="font-bold">{totalSections}</span>
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
          {currentSections.map(
            ({
              r_titulo,
              r_id_seccion,
              r_descripcion,
              r_admin_seccion,
              r_estado,
              r_erroneo,
              r_visibilidad,
            }) => (
              <div
                key={r_id_seccion}
                className={`${
                  r_erroneo
                    ? "bg-red-400"
                    : r_estado
                    ? " bg-blue-gray-50"
                    : "bg-orange-400"
                }  shadow-sm rounded-none cursor-pointer hover:border-4 ${
                  sidenavColors[sidenavColor]
                } 
                 ${shadows[sidenavColor]}`}
                onClick={() => AbrirNiveles(r_id_seccion, r_titulo)}
              >
                <div className="bg-zinc-900 rounded-2xl">
                  <div className="mx-auto">
                    <div className="text-center">
                      <Avatar
                        src={"/img/Home/materia_icon.png"}
                        alt={r_titulo}
                        size="xl"
                        className="mt-3"
                      />
                    </div>
                    <div className="w-full p-4">
                      <input
                        className={`${
                          r_erroneo
                            ? "bg-red-400 text-white"
                            : r_estado
                            ? "bg-blue-gray-50 text-black"
                            : "bg-orange-400 text-white"
                        }  w-full text-lg font-semibold	text-blue-gray-800 `}
                        disabled
                        value={r_titulo}
                      />
                    </div>
                    <div className="flex">
                      {r_admin_seccion ? (
                        <div className="w-auto flex ml-2 mb-2">
                          <Tooltip content="Es Admin">
                            <Chip
                              variant="gradient"
                              size="sm"
                              color="green"
                              value="Admin"
                            />
                          </Tooltip>
                        </div>
                      ) : (
                        <div className="w-auto flex ml-2 mb-2">
                          <Tooltip content="Es Invitado">
                            <Chip
                              variant="gradient"
                              size="sm"
                              color="blue"
                              value="Invitado"
                            />
                          </Tooltip>
                        </div>
                      )}
                      {!r_estado && (
                        <div className="w-auto flex ml-2 mb-2">
                          <Tooltip content="Esta Deshabilitada la seccion">
                            <Chip
                              variant="gradient"
                              size="sm"
                              color="yellow"
                              value={"Deshabilitado"}
                            />
                          </Tooltip>
                        </div>
                      )}
                      {r_erroneo && (
                        <div className="w-auto flex ml-2 mb-2">
                          <Tooltip content="La seccion se encuentra con errores ">
                            <Chip
                              variant="gradient"
                              size="sm"
                              color="orange"
                              value={"Erroneo"}
                            />
                          </Tooltip>
                        </div>
                      )}
                      {r_visibilidad ? (
                        <div className="w-auto flex ml-2 mb-2">
                          <Tooltip content="La seccion se encuentra publica ">
                            <EyeIcon className="h-7" color="black" />
                          </Tooltip>
                        </div>
                      ) : (
                        <div className="w-auto flex ml-2 mb-2">
                          <Tooltip content="La seccion se encuentra privada ">
                            <EyeSlashIcon className="h-7" color="black" />
                            {/** <Chip
                              variant="gradient"
                              size="sm"
                              color="cyan"
                              value={"Privado"}
                            />*/}
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    {/* 
                    <div className="p-2 flex justify-end">
                      <Tooltip content="Ir a la seccion">
                        <button
                          className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer"
                          onClick={() => AbrirNiveles(r_id_seccion, r_titulo)}
                        >
                          <ArrowRightCircleIcon className="w-7" color="white" />
                        </button>
                      </Tooltip>
                    </div>
*/}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
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
      <Notification mensaje="Seccion creada" abrir={openAlert} crear={crear} />
    </Card>
  );
}
