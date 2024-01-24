import {
  ArrowRightCircleIcon,
  PlusCircleIcon,
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
} from "@material-tailwind/react";

//cabezera para la tabla de participantes
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AddSeccion,
  SeccionesDisponibles,
} from "@/pages/dashboard/FormulariosC";

export default function SeleccionarSecciones({ idTest_id, Regresar }) {
  //funcion que obtenga las secciones disponibles para ser seleccionadas
  const [load, setLoader] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [openSeccionesDisponibles, setSeccionesDisponibles] = useState(false);
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
  return (
    <Card className="h-full w-full mt-5 rounded-none">
      <Notification
        mensaje="Seccion agregada"
        abrir={openAlert}
        crear={crear}
      />
      {load ? <Loader /> : ""}
      {openAgregarSeccion ? <AddSeccion cerrar={cerrarAgregar} /> : ""}
      {openSeccionesDisponibles ? (
        <SeccionesDisponibles
          ID_seccion_p={idTest_id}
          cerrar={cerrar}
          crear={crear}
          idtest={idTest_id}
        />
      ) : (
        ""
      )}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de secciones
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Estas secciones estan agregadas al test
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="outlined"
              size="sm"
              color="orange"
              onClick={Regresar}
            >
              Lista de Test
            </Button>
            {/* 
            <Button className="flex items-center gap-3" size="sm" color="green">
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Agregar
              Participante
            </Button>
*/}
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        {/* Tarjetas de las secciones disponibles*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
          {secciones.map(
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
                className="bg-blue-gray-50 shadow-2xl rounded-2xl"
              >
                <div className="bg-zinc-900 text-black shadow-2xl rounded-2xl">
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

                    <div className="p-2 flex justify-end">
                      <Tooltip content="Editar seccion">
                        <button className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer">
                          <ArrowRightCircleIcon className="w-7" color="white" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
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
        </div>
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
