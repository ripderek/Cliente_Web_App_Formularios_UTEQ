import { useState, useEffect } from "react";
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
import Cookies from "universal-cookie";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import {
  ArrowRightCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
const TABLE_HEAD = ["Nivel", "Numero de preguntas"];
export default function SeccionesDisponibles({
  cerrar,
  id_seccion,
  crear,
  idtest,
}) {
  const [load, setLoader] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  useEffect(() => {
    Obtener_Secciones_Usuario();
  }, []);
  const Obtener_Secciones_Usuario = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "secciones/Secciones_Disponibles_test",
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
  const agregar_seccion = () => {
    crear(true);
    cerrar();
    handlerAgg();
  };
  //funcion para registrar la seccion en el test
  const [openAgregarS, setOpenAgregarS] = useState(false);
  const handlerAgg = () => {
    setOpenAgregarS(!openAgregarS);
  };
  const [preguntas, setPreguntas] = useState([]);
  //obtener las preguntas disponibles por nivel
  const ObtenerPreguntasNiveles = async (id) => {
    setLoader(true);
    SetRegistro({ ...seccionRegistro, ["p_id_seccion"]: id });
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "secciones/PreguntasNivelSeccion/" +
          id,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setPreguntas(data);
      //console.log(result.data);
      setLoader(false);
      console.log(data);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setError(true);
      setMensajeError(error.response.data.error);
    }
  };
  //funcion para registrar la wea fobe
  const [seccionRegistro, SetRegistro] = useState({
    p_id_test: idtest,
    p_id_seccion: id_seccion,
    p_numero_preguntas: "",
  });
  const HandleChange = (e) => {
    SetRegistro({ ...seccionRegistro, [e.target.name]: e.target.value });
    console.log(seccionRegistro);
  };
  const RegistrarSeccionTest = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/AgregarSeccionTest",
        seccionRegistro,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      agregar_seccion();
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const cerrar1 = (valor) => {
    setError(valor);
  };
  return (
    <>
      {load ? <Loader /> : ""}
      {error ? (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      ) : (
        ""
      )}
      <Dialog size="xxl" open={true} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full h-full">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Secciones Disponibles
            </Typography>
            <IconButton
              className="!absolute top-3 right-3 bg-transparent shadow-none"
              onClick={() => cerrar()}
            >
              <XCircleIcon className="w-11" color="orange" />
            </IconButton>
            {/* 
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Llene el formulario
            </Typography>
*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
              {secciones.map(({ r_titulo, r_id_seccion, r_num_niveles }) => (
                <div
                  key={r_id_seccion}
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
                            value={"Niveles: " + r_num_niveles}
                          />
                        </Tooltip>
                      </div>

                      <div className="p-2 flex justify-end">
                        <Tooltip content="Agregar al test">
                          <button
                            className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer"
                            onClick={() => (
                              handlerAgg(),
                              ObtenerPreguntasNiveles(r_id_seccion)
                            )}
                          >
                            <PlusCircleIcon className="w-7" color="white" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            {/*
            <Button variant="gradient" fullWidth color="green">
              Aceptar
            </Button>
            */}
          </CardFooter>
        </Card>
      </Dialog>
      {/* Formulario para agregar la cantidad de preguntas para la seccion por niveles */}
      <Dialog
        size="xs"
        open={openAgregarS}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full h-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Numero de preguntas
            </Typography>
            <IconButton
              className="!absolute top-3 right-3 bg-transparent shadow-none"
              onClick={handlerAgg}
            >
              <XCircleIcon className="w-11" color="orange" />
            </IconButton>

            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Llene el formulario
            </Typography>
            {/* Tabla con el numero de preguntas segun la seccion y el nivel */}
            <table className="w-full min-w-max table-auto text-left">
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
                    { r_id_nivel, r_id_seccion, r_nivel, r_total_preguntas },
                    index
                  ) => {
                    const isLast = index === preguntas.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={r_id_nivel}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {r_nivel}
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
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            <Input
              label="Ingrese cantidad de preguntas"
              size="lg"
              name="p_numero_preguntas"
              onChange={HandleChange}
            />
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
    </>
  );
}
