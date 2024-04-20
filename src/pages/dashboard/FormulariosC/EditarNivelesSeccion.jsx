import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  IconButton,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Avatar,
  Tooltip,
} from "@material-tailwind/react";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ArrowRightCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
const TABLE_HEAD = ["Nivel", "Numero de preguntas", ""];

export default function EditarNivelesSeccion({ id_seccion, id_test, cerrar }) {
  const [load, setLoader] = useState(false);

  const [preguntas, setPreguntas] = useState([]);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  useEffect(() => {
    ObtenerPreguntasNiveles();
  }, []);
  const ObtenerPreguntasNiveles = async (id) => {
    setLoader(true);
    //SetRegistro({ ...seccionRegistro, ["p_id_seccion"]: id });
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/fu_listar_niveles_num_preguntas/" +
          id_seccion +
          "/" +
          id_test,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      //añadirle un campo extra parque contenga el numero de preguntas por nivel a ingresar
      setPreguntas(data);
      console.log(data);
      setLoader(false);
      console.log(data);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  const cerrar1 = (valor) => {
    setError(valor);
  };
  const actualizarNumPreguntas = (json, idNivel, nuevasPreguntas) => {
    return json.map((item) => {
      if (item.r_id_test_niveles === idNivel) {
        return { ...item, r_num_preguntas: nuevasPreguntas };
      }
      return item;
    });
  };
  const handleCambiarNumeroPreguntasNivel = (id_nivel, num_preguntas) => {
    const newData = actualizarNumPreguntas(preguntas, id_nivel, num_preguntas);
    setPreguntas(newData);
  };
  const RegistrarSeccionTest = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      //ahora enviar el id del test, id de la seccion y Json con los niveles
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/sp_actualizar_niveles_preguntas_seccion_test",
        {
          p_id_test: id_test,
          p_id_seccion: id_seccion,
          p_numero_preguntas: preguntas,
        },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      cerrar();
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  return (
    <div>
      {load && <Loader />}
      {error && (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      )}
      <Dialog size="sm" open={true} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full h-full">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Numero de preguntas
            </Typography>
            <IconButton
              className="!absolute top-3 right-3 bg-transparent shadow-none"
              onClick={cerrar}
            >
              <XCircleIcon className="w-11" color="orange" />
            </IconButton>

            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Ingrese el numero de preguntas por nivel
            </Typography>
            {/* Tabla con el numero de preguntas segun la seccion y el nivel */}
            <table className="w-96 mx-auto  table-auto text-left">
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
                {preguntas.map(
                  (
                    {
                      r_id_test_niveles,
                      r_id_seccion,
                      r_nivel,
                      r_total_preguntas,
                      r_num_preguntas,
                    },
                    index
                  ) => {
                    const isLast = index === preguntas.length - 1;
                    const classes = isLast
                      ? "p-2"
                      : "p-2 border-b border-blue-gray-50";

                    return (
                      <tr key={r_id_test_niveles}>
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
                            {r_total_preguntas}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Input
                            label="Numero de preguntas"
                            name="p_numero_preguntas"
                            onChange={(e) =>
                              handleCambiarNumeroPreguntasNivel(
                                r_id_test_niveles,
                                e.target.value
                              )
                            }
                            value={r_num_preguntas}
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              color="green"
              onClick={RegistrarSeccionTest}
            >
              Aceptar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
}
