import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ArrowRightCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
const TABLE_HEAD = ["Nivel Inicial", "Nivel Salto", ""];
import { VerDetalleSalto, CrearSalto } from "@/pages/dashboard/FormulariosC";

export default function SaltosNivel({ id_test, cerrar, id_seccion }) {
  //cargar los niveles que son diferentes de 0 las preguntas
  const [load, setLoader] = useState(false);
  const [ListaSaltos, SetListaSaltos] = useState([]);
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  const Obtener_Secciones_Usuario = async () => {
    //cargar solo las secciones que contiene el formulario
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/fu_listar_saltos_seccion/" +
          id_test +
          "/" +
          id_seccion,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetListaSaltos(data);
      //console.log(data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
      console.log(error);
    }
  };
  //funcion para ver la pregunta que contiene  el salto de nivel con la opcion
  //enviar el id_test_, id_seccion_ , id_nivel incia y luego retornar la wea fobe
  const [VerSalto, SetVerSalto] = useState(false);
  const [Nivel, SetNivel] = useState(0);
  const [SaltoNivel, setSaltoNivel] = useState(0);
  const HandleVerSalto = (id_nviel_sa, salto) => {
    SetNivel(id_nviel_sa);
    setSaltoNivel(salto);
    SetVerSalto(true);
  };
  const [CrearSalto2, setCrearSalto] = useState(false);

  return (
    <>
      <Dialog open={true} handler={cerrar}>
        {load && <Loader />}
        {/* PARA CREAR SALTOS DE NIVEL */}
        {CrearSalto2 ? (
          <CrearSalto
            id_test={id_test}
            id_seccion={id_seccion}
            cerrar={() => setCrearSalto(false)}
          />
        ) : (
          ""
        )}
        {/* PARA VER EL DETALLE DEL SALTO QUE SE VA A DAR POR NIVEL*/}
        {VerSalto ? (
          <VerDetalleSalto
            idtest={id_test}
            idnivel={Nivel}
            iidsecciontest={id_seccion}
            nivelSalto={SaltoNivel}
            cerrar={() => SetVerSalto(false)}
          />
        ) : (
          ""
        )}
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Saltos de niveles
          </Typography>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
          <div className="flex-row mx-auto text-center bg-white">
            <IconButton
              className="mx-auto bg-white"
              onClick={() => setCrearSalto(true)}
            >
              <PlusCircleIcon className="w-16" color="green" />
            </IconButton>
          </div>
          {ListaSaltos.length !== 0 && (
            <div className="h-96 overflow-y-auto mt-5">
              <table className="w-auto mx-auto  table-auto text-center">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
                  {ListaSaltos.map(
                    ({ r_id_nivel, r_nivel, r_nivel_salto }, index) => {
                      const isLast = index === ListaSaltos.length - 1;
                      const classes = isLast
                        ? "p-2"
                        : "p-2 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              Nivel {r_nivel}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              Nivel {r_nivel_salto}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <IconButton
                              className="mx-auto bg-white"
                              onClick={() =>
                                HandleVerSalto(r_id_nivel, r_nivel_salto)
                              }
                            >
                              <EyeIcon className="w-11" color="green" />
                            </IconButton>
                            <IconButton className="mx-auto bg-white ml-7">
                              <TrashIcon className="w-11" color="red" />
                            </IconButton>
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
      </Dialog>
    </>
  );
}
