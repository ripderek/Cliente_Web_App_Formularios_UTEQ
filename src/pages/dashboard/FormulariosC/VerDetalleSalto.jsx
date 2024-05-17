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
const TABLE_HEAD = ["Opcion", ""];

export default function VerDetalleSalto({
  idtest,
  idnivel,
  iidsecciontest,
  cerrar,
  nivelSalto,
}) {
  const [load, setLoader] = useState(false);
  const [ListaSaltos, SetListaSaltos] = useState([]);
  useEffect(() => {
    ObtenerDtalle();
  }, []);
  const ObtenerDtalle = async () => {
    //cargar solo las secciones que contiene el formulario
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/fu_ver_detalle_salto/" +
          idtest +
          "/" +
          idnivel +
          "/" +
          iidsecciontest,
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
      console.log(data);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      alert("Error");
      console.log(error);
    }
  };
  return (
    <>
      <Dialog open={true} handler={cerrar} size="xl">
        {load && <Loader />}
        <Typography variant="h4" color="blue-gray"></Typography>

        <DialogBody>
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none z-10"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" onClick={cerrar} />
          </IconButton>
          {ListaSaltos.length !== 0 && (
            <div className="flex-row">
              <textarea
                className="border w-full p-2 border-yellow-900 rounded-sm mt-8"
                size="lg"
                value={ListaSaltos[0].r_enunciado}
                disabled
              />

              <div className="h-96 overflow-y-auto mt-5">
                <table className="w-auto mx-auto  table-auto text-left">
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
                    {ListaSaltos.map(({ r_opcion, r_salto }, index) => {
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
                              {r_opcion}
                            </Typography>
                          </td>
                          <td className={classes}>
                            {r_salto ? (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                Salto nivel: {nivelSalto}
                              </Typography>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  );
}
