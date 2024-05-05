import {
  ArrowRightCircleIcon,
  PlusCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  Tooltip,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";

//cabezera para la tabla de participantes
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState } from "react";
import axios from "axios";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { EditarNivelesSeccion } from "@/pages/dashboard/FormulariosC";
import {
  AddSeccion,
  SeccionesDisponibles,
} from "@/pages/dashboard/FormulariosC";
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

export default function SeleccionarSecciones({
  idTest_id,
  Regresar,
  TituloTest,
}) {
  
    //Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState("5");
  const itemsPorPag = value; // Numero de niveles a mostra por pagina

  //funcion que obtenga las secciones disponibles para ser seleccionadas
  const [load, setLoader] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [openSeccionesDisponibles, setSeccionesDisponibles] = useState(false);
  const [infoTest, setInforTest] = useState([]);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [openEliminar, setOpenEliminar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  const Obtener_Secciones_Usuario = async () => {
    //cargar solo las secciones que contiene el formulario
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/SeccionesTest/" + idTest_id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSecciones(data);
      //Para saber si es edtiable el test
      const response2 = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/IsEditableTest/" + idTest_id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data2 = await response2.json();
      setInforTest(data2);
      //console.log(result.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  const [openAgregarSeccion, setOpenAgregarSecion] = useState(false);
  const cerrarAgregar = () => {
    setOpenAgregarSecion(false);
  };
  const cerrar = () => {
    setSeccionesDisponibles(false);
  };
  const [openAlert, setOpenAlert] = useState(false);
  const crear = (value) => {
    setOpenAlert(value);
    Obtener_Secciones_Usuario();
  };
  const [id_seccion_eliminar, setid_seccion_eliminar] = useState(0);
  //peticion fetch para eliminar la seccino del test
  const Eliminar_Seccion = async () => {
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/eliminar_seccion_test",
        {
          p_id_test: idTest_id,
          p_id_seccion: id_seccion_eliminar,
        },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      setOpenEliminar(false);
      Obtener_Secciones_Usuario();
    } catch (error) {
      console.log(error);
      setLoader(false);
      alert("Error");
    }
  };

  //Paginacion

  // Obtener el total de páginas
  const totalNiveles = secciones.length;
  const totalPages = Math.ceil(totalNiveles / itemsPorPag);

  // Calcular el índice del primer y último formulario en la página actual
  const indexOfLastItem = currentPage * itemsPorPag;
  const indexOfFirstItem = indexOfLastItem - itemsPorPag;
  const currentItems = secciones.slice(indexOfFirstItem, indexOfLastItem);

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
      <Notification
        mensaje="Seccion agregada"
        abrir={openAlert}
        crear={crear}
      />
      {load && <Loader />}
      {openAgregarSeccion && <AddSeccion cerrar={cerrarAgregar} />}
      {openSeccionesDisponibles && (
        <SeccionesDisponibles
          ID_seccion_p={idTest_id}
          cerrar={cerrar}
          crear={crear}
          idtest={idTest_id}
        />
      )}
      {openEditar && (
        <EditarNivelesSeccion
          cerrar={() => setOpenEditar(false)}
          id_test={idTest_id}
          id_seccion={id_seccion_eliminar}
        />
      )}
      {/* openEliminar */}
      <Dialog open={openEliminar} handler={() => setOpenEliminar(false)}>
        <DialogHeader>Eliminar Seccion del test</DialogHeader>
        <DialogBody>¿Desea eliminar la seccion del test?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenEliminar(false)}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => Eliminar_Seccion()}
          >
            <span>Aceptar</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="black">
              {TituloTest}
            </Typography>
            <Typography variant="h5" color="blue-gray">
              Lista de secciones
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Estas secciones estan agregadas al test:
              <span className="font-bold">{" " + secciones.length}</span>
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

            {/* 
            <Button className="flex items-center gap-3" size="sm" color="green">
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Agregar
              Participante
            </Button>
*/}
          </div>
        </div>
        {!infoTest.r_is_editable && (
          <Alert
            color="amber"
            icon={<ExclamationTriangleIcon color="black" className="h-7 w-7" />}
          >
            Las funciones de editar, eliminar y agregar secciones se han
            bloqueado debido a que el test se encuentra en desarrollo
          </Alert>
        )}
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {/* Tarjetas de las secciones disponibles*/}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5">
          {currentItems.map(
            ({
              r_id_test_secciones,
              r_estad_test_seccion,
              r_cantidad_niveles,
              r_id_seccion,
              r_descripcion,
              r_titulo,
              r_estado_seccion,
            }) => (
              <div
                key={r_id_test_secciones}
                className={`bg-blue-gray-50 shadow-sm rounded-none  border-4 ${sidenavColors[sidenavColor]}  ${shadows[sidenavColor]}`}
              >
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
                      className="w-full text-lg bg-blue-gray-50 font-semibold	text-blue-gray-800 "
                      disabled
                      value={r_titulo}
                    />
                  </div>
                  <div className="w-auto flex ml-2 mb-2">
                    <Tooltip content="Niveles verificados">
                      <Chip
                        variant="ghost"
                        size="sm"
                        color="orange"
                        value={"Niveles: " + r_cantidad_niveles}
                      />
                    </Tooltip>
                  </div>
                  {infoTest.r_is_editable && (
                    <div className="flex justify-end">
                      <div className="p-2 flex justify-end">
                        <Tooltip content="Editar seccion">
                          <button
                            className="bg-zinc-50 p-2 bg-orange-500 rounded-xl cursor-pointer"
                            onClick={() => (
                              setid_seccion_eliminar(r_id_seccion),
                              setOpenEditar(true)
                            )}
                          >
                            <PencilIcon className="w-7" color="white" />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="p-2 flex justify-end">
                        <Tooltip content="Quitar seccion">
                          <button
                            className="bg-zinc-50 p-2 bg-red-600 rounded-xl cursor-pointer"
                            onClick={() => (
                              setid_seccion_eliminar(r_id_seccion),
                              setOpenEliminar(true)
                            )}
                          >
                            <TrashIcon className="w-7" color="white" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
          {infoTest.r_is_editable && (
            <div
              className="bg-green-600 shadow-2xl h-20 w-20 ml-6 mt-12 rounded-2xl cursor-pointer"
              onClick={() => setSeccionesDisponibles(true)}
            >
              <Tooltip content="Agregar una seccion">
                <PlusCircleIcon
                  color="white"
                  className="mx-auto items-center text-center h-20"
                  onClick={() => setSeccionesDisponibles(true)}
                />
              </Tooltip>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Paguina {currentPage} de {totalPages}
        </Typography>
        <div className="flex">
          <Select
            label="N° Secciones"
            value={value}
            onChange={(val) => setValue(val)}
          >
            <Option value="5">5</Option>
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value={secciones.length}>Todos</Option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm"onClick={handlePreviousPage}>
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
