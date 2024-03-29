import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  ArrowRightCircleIcon,
  UsersIcon,
  XCircleIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
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
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState } from "react";
//const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];
import axios from "axios";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
export default function ListaNiveles({
  id_seccion,
  AbrirSecciones,
  Titulo,
  AbrirPreguntas,
}) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [load, setLoader] = useState(false);
  //estado para almacenar todos los niveles de una seccion
  const [niveles, setNiveles] = useState([]);

  //estado para abrir la alerta si desea crear un nuevo nivel
  const [openCreateNivel, SetOpenCreateNivel] = useState(false);
  useEffect(() => {
    ObtenerNiveles();
  }, []);
  //funcion para cargar los niveles que tiene una seccion
  const ObtenerNiveles = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "niveles/Niveles_Seccion/" +
          id_seccion,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setNiveles(data);
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
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  //funcion para crear un nivel
  const Crear_Nivel = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "niveles/Crear_Nivel/" + id_seccion,
        "",
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      SetOpenCreateNivel(false);
      setOpenAlert(true);
      ObtenerNiveles();
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };

  const crear = (value) => {
    setOpenAlert(value);
  };
  const cerrar1 = (valor) => {
    setError(valor);
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

  //EN ESTA CASO ESTAS FUNCIONES SIRVEN PARA ELIMINAR TODA LA SECCION CON SUS NIVELES INCLUIDOS
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
          "preguntas/SP_eliminar_Seccion_Contenido",
        { p_id_seccion: id_seccion },

        {
          withCredentials: true,
        }
      );
      setLoader(false);
      setDeseaEliminarNivel(false);
      AbrirSecciones();
    } catch (error) {
      setLoader(false);
      alert("Error");
      console.log(error);
    }
  };
  return (
    <Card className="h-full w-full rounded-none">
      {load ? <Loader /> : ""}
      {error ? (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al crear el nivel"
          cerrar={cerrar1}
        />
      ) : (
        ""
      )}
      <Notification mensaje="Nivel creado" abrir={openAlert} crear={crear} />
      <Dialog open={openCreateNivel} size={"xs"}>
        <DialogHeader>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none p-2"
            onClick={() => SetOpenCreateNivel(false)}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <Typography color="black" className="mt-4 mb-3 font-bold text-xl">
            ¿Desea añadir un nuevo nivel?
          </Typography>
          Si acepta se creará un nuevo nivel
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={Crear_Nivel}>
            <span>Aceptar</span>
          </Button>
        </DialogFooter>
      </Dialog>
      {/* DIALOG PARA ABRIR LA CONFIGURACION DE LA SECCION   */}
      <Dialog open={AbrirConfig} handler={() => setAbrirConfig(false)}>
        <Dialog open={DeseaEliminarNivel}>
          <DialogHeader>Eliminar</DialogHeader>
          <DialogBody>
            ¿Esta seguro que desea eliminar la seccion? Esta acción no se puede
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
                    <span>Eliminar seccion </span>
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
              Lista de niveles
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Niveles de la seccion {Titulo}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Seleccione un nivel para ir a las preguntas
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Tooltip content="Regresar">
              <Button
                variant="outlined"
                size="sm"
                color="orange"
                onClick={AbrirSecciones}
              >
                <ArrowLeftOnRectangleIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </Tooltip>
            <Tooltip content="Crear Nivel">
              <Button
                className="flex items-center gap-3"
                size="sm"
                color="green"
                onClick={() => SetOpenCreateNivel(true)}
              >
                <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Crear
                nivel
              </Button>
            </Tooltip>
            <Tooltip content="Editar">
              <Button
                className="flex items-center gap-3"
                size="sm"
                color="cyan"
              >
                <PencilIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Participantes">
              <Button
                className="flex items-center gap-3"
                size="sm"
                color="blue-gray"
              >
                <UsersIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </Tooltip>
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
          {/* 
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
          */}
        </div>
      </CardHeader>
      <CardBody className="px-0">
        {niveles.length == 0 ? (
          <div className="mx-auto items-center text-center font-bold text-2xl">
            Esta seccion no tiene niveles
          </div>
        ) : (
          ""
        )}
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 ml-5"
        >
          Numero de niveles:
          <span className="font-bold">{niveles.length}</span>
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 p-5">
          {niveles.map(
            (
              { r_id_nivel, r_id_seccion, r_nivel, r_total_preguntas },
              index
            ) => (
              <div
                key={r_id_nivel}
                className={`bg-blue-gray-50 shadow-sm rounded-none cursor-pointer hover:border-4 ${sidenavColors[sidenavColor]}  ${shadows[sidenavColor]}`}
                onClick={() => AbrirPreguntas(r_id_nivel, r_nivel)}
              >
                <div className="bg-zinc-900 rounded-2xl">
                  <div className="mx-auto">
                    <div className="w-full p-4 text-center">
                      <input
                        className="w-full bg-blue-gray-50 font-bold text-xl 	text-blue-gray-800 "
                        disabled
                        value={r_nivel}
                      />
                    </div>
                    <div className="w-auto flex mb-3">
                      <Chip
                        variant="ghost"
                        size="sm"
                        color="yellow"
                        value={"Preguntas: " + r_total_preguntas}
                      />
                    </div>
                    {/* 
                    <div className="p-2 flex justify-end">
                      <Tooltip content="Ir a las preguntas ">
                        <button
                          className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer"
                          onClick={() => AbrirPreguntas(r_id_nivel, r_nivel)}
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
    </Card>
  );
}
