import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
const TABLE_HEAD = ["", "Fecha", "Hora", "IP", "Agente"];

export default function IngresosUsuario({
  idParticipante,
  cerrar,
  nombreUsuario,
}) {
  //hacer una funcion para cargar los ingresos
  const [load, setLoader] = useState(false);
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
          "test/IngresosUsuarios/" +
          idParticipante,
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
      <Dialog open={true} handler={cerrar} size="xl">
        <DialogHeader>
          Ingresos
          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={cerrar}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <span className="font-bold">{nombreUsuario}</span> registra los
          siguientes ingresos
          <table className="mt-4 w-full min-w-max table-auto text-left">
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
                (
                  {
                    r_id_ingreso,
                    r_fecha_ingreso,
                    r_ip_ingreso,
                    r_dispositivo,
                    r_hora_ingreso,
                  },
                  index
                ) => {
                  const isLast = index === secciones.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr
                      key={r_id_ingreso}
                      className="hover:bg-yellow-300 cursor-pointer"
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
                            {r_fecha_ingreso}
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
                            {r_hora_ingreso}
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
                            {r_ip_ingreso}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes} style={{ maxWidth: "200px" }}>
                        <div
                          className="flex flex-col"
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {r_dispositivo}
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </DialogBody>
      </Dialog>
    </>
  );
}
