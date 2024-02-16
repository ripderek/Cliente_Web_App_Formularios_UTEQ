import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Card,
  CardHeader,
  Input,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { XCircleIcon } from "@heroicons/react/24/solid";

import {
  MagnifyingGlassIcon,
  NoSymbolIcon,
  LockOpenIcon,
  LockClosedIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
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
export default function ProgresoSecciones({
  id_participante_test,
  abrirSeccion,
}) {
  const [load, setLoader] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  //funcion para cargar las secciones que tiene el usuario obteniendo su id de la cookie
  const Obtener_Secciones_Usuario = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/ProgresoSeccionesUsuarioMonitoreo/" +
          id_participante_test,
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
    }
  };
  return (
    <>
      {load && <Loader />}
      <div className="h-80 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 ">
          {secciones.map(
            ({
              r_id_progreso_seccion,
              r_id_seccion,
              r_id_participante_test,
              r_estado_completado,
              r_bloqueado,
              porcentaje,
              r_titulo,
              r_descripcion,
            }) => (
              <div
                key={r_id_progreso_seccion}
                className="bg-blue-gray-50 shadow-2xl rounded-none  border-orange-500 border-4 border-solid cursor-pointer  hover:shadow-yellow-900"
                onClick={() => abrirSeccion(r_id_progreso_seccion)}
              >
                <div className="bg-zinc-900 text-black shadow-2xl rounded-none">
                  <div className="mx-auto">
                    <div className="text-center">
                      <Avatar
                        src={"/img/Home/materia_icon.png"}
                        alt={r_titulo}
                        size="xl"
                        className="mt-3"
                      />
                    </div>
                    <div className="w-full p-4 mx-auto text-center">
                      <input
                        className="w-full text-lg bg-blue-gray-50 font-semibold	text-blue-gray-800 mx-auto text-center"
                        disabled
                        value={r_titulo}
                      />
                    </div>

                    {r_estado_completado ? (
                      <div className="w-auto flex ml-2 mb-2">
                        <Chip
                          variant="ghost"
                          size="sm"
                          color="green"
                          value="Completado"
                        />
                      </div>
                    ) : (
                      <div className="w-auto flex ml-2 mb-2">
                        <Chip
                          variant="ghost"
                          size="sm"
                          color="orange"
                          value="Incompleto"
                        />
                      </div>
                    )}

                    <div className="w-auto flex ml-2 mb-2">
                      <Chip
                        variant="ghost"
                        size="sm"
                        color="blue-gray"
                        //r_porcentaje +
                        value={porcentaje + "%"}
                        className=" text-2xl"
                      />
                    </div>

                    <div className="p-2 flex justify-end">
                      {r_bloqueado ? (
                        <Tooltip content="Seccion bloqueada">
                          <button
                            className="bg-zinc-50 p-2 bg-green-700 rounded-none cursor-pointer border-gray-50 border-4"
                            disabled
                          >
                            <LockClosedIcon className="w-7" color="white" />
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Seccion desbloqueada">
                          <button
                            className="bg-zinc-50 p-2 bg-green-700 rounded-none cursor-pointer border-gray-50 border-4"
                            disabled
                          >
                            <LockOpenIcon className="w-7" color="white" />
                          </button>
                        </Tooltip>
                      )}
                      <Tooltip content="Reestablecer Seccion" className="z-30">
                        <button
                          className="bg-zinc-50 p-2 bg-red-900 rounded-none cursor-pointer border-gray-50 border-4"
                          disabled
                        >
                          <ArrowPathIcon className="w-7" color="white" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
