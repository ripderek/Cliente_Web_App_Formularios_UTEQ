import { useEffect, useState, useRef } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
  Chip,
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
  Switch,
} from "@material-tailwind/react";
import { AiOutlineUpload } from "react-icons/ai";
import {
  UserPlusIcon,
  ArrowRightCircleIcon,
  PencilIcon,
  PlusCircleIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function SELCCLA_resp({
  id_pregunta,
  buscar,
  id_nivel,
  AbrirPreguntas,
  idni,
  nombrenivel,
}) {
  const [load, setLoader] = useState(false);
  const [data_user, setData_User] = useState([]);
  const [IDPregunta, setIdPregunta] = useState(0);
  //funcion para buscar los datos de una pregunta como la foto, el enunciado.
  //si se envia a buscar entonces hay que devolver la ultima pregunta creada.
  useEffect(() => {
    obtener_datos_pregunta();
    //else buscar_por_id
  }, []);
  //funcion para hacer la peticion y obtener los datos de la pregunta
  const obtener_datos_pregunta = async () => {
    //alert(id_pregunta + " " + buscar + " " + id_nivel);
    setLoader(true);
    console.log(id_pregunta + "-" + buscar + "-" + id_nivel);
    try {
      if (buscar) {
        //alert("Buscando");
        //alert("Buscar por nivel: " + id_nivel);
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "preguntas/SELCIMG_Datos_pregunta/" +
            id_nivel,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const data = await response.json();
        setData_User(data);
        setLoader(false);
        console.log(data);
        setIdPregunta(data.r_id_pregunta);
        cargarRespuestas(data.r_id_pregunta);
      } else {
        //alert("Editando por ID");
        //alert("Buscar por id_pregunta: " + id_pregunta);
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "preguntas/SELCIMG_Datos_pregunta_id_pregunta/" +
            id_pregunta,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setData_User(data);
        setLoader(false);
        setIdPregunta(data.r_id_pregunta);
        cargarRespuestas(data.r_id_pregunta);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const ver = () => {
    alert(IDPregunta);
  };
  const [respuestas, setRespuestas] = useState([]);
  //funcion para cargar todas las respuestas de una pregunta MEMRZAR
  const cargarRespuestas = async (value_id_pregunta) => {
    setLoader(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_ACCESLINK +
        "preguntas/RespuestasMEMRZAR/" +
        value_id_pregunta,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    setRespuestas(data);
    setRespuesta("");
    setIsChecked(false);
    setLoader(false);
  };
  //estado para abrir el dialog para anadir una opcion de respuesta
  const [openNew, setOpenNew] = useState(false);
  const hanldeOpen = () => {
    setOpenNew(!openNew);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  //funcion para guardar la repuesta en la pregunta
  const Crear_Respuesta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      //alert(IDPregunta);
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "preguntas/Crea_respuesta_text",
        {
          respuesta: respuesta,
          id_pregunta: IDPregunta,
          p_correcta: isChecked,
        },
        {
          withCredentials: true,
        }
      );

      setLoader(false);
      setRespuesta("");
      setIsChecked(false);
      //se manda 0 como id porque se desconoce el id de la pregunta que se creo, y se envia true como segundo parametro para que relize la busqueda de la ultima pregunta en la sigueinte ventana en un useEffect
      //AbrirEditarMEMRZAR(0, true);
      cargarRespuestas(IDPregunta);
      setOpenNew(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.message);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const [respuesta, setRespuesta] = useState("");
  const cerrar1 = (valor) => {
    setError(valor);
  };
  return (
    <Card className="w-auto mt-6 mx-auto">
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
      {/* Para agregar una opcion de respuesta a la pregunta con imagen*/}
      <Dialog open={openNew} handler={hanldeOpen}>
        <DialogBody className="w-full">
          <Typography variant="h4" color="blue-gray">
            Agregar opcion de respuesta
          </Typography>

          <textarea
            className="border p-2 rounded-sm font-bold w-full h-full mt-3"
            rows={5} // Número de filas
            cols={50} // Número de columnas
            value={respuesta}
            placeholder="Aquí escribe la respuesta"
            onChange={(e) => setRespuesta(e.target.value)}
          />
          <div className="flex items-center">
            <Typography className="text-lg font-bold" color="black">
              ¿Respuesta Correcta?:
            </Typography>
            <Checkbox
              color="green"
              checked={isChecked}
              onChange={handleChange}
            />
          </div>

          <IconButton
            className="!absolute top-3 right-3 bg-transparent shadow-none"
            onClick={hanldeOpen}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={Crear_Respuesta}>
            Aceptar
          </Button>
        </DialogFooter>
      </Dialog>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-1 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h4" color="orange">
              Pregunta:
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="gradient"
              size="sm"
              color="orange"
              onClick={() => AbrirPreguntas(idni, nombrenivel)}
            >
              Regresar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {/* AbrirPreguntas()*/}

        {/* 
        <Typography className="text-lg font-bold" color="black">
          Escriba el enunciado:
        </Typography>
        */}
        <textarea
          className="border p-2  rounded-sm font-bold"
          size="lg"
          value={data_user.r_enunciado}
        />
        {/*
        <div className="flex items-center">
          <Typography className="text-lg font-bold" color="black">
            Tiempo disponible para responder (segundos):
          </Typography>
          <input
            className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
            type="number"
          />
        </div>
         
        <Typography className="text-lg font-bold" color="black">
          Imagen a Memorizar:
        </Typography>
        */}
        {/*
        <div className="mx-auto bg-yellow-800 p-2 rounded-xl">
          <label htmlFor="fileInput" className="text-white font-bold ">
            Subir Foto:
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={ImagePreview}
            accept="image/png, .jpeg"
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            className="ml-3  rounded-xl  bg-white h-11"
            onClick={handleButtonClick}
          >
            <AiOutlineUpload size="25px" color="black" />
          </Button>
        </div>
*/}
        <Typography variant="h4" color="orange">
          Opciones:
        </Typography>
        {respuestas.length === 0 ? (
          <Typography variant="h5" color="black" className="mx-auto">
            No existen opciones de respuestas
          </Typography>
        ) : (
          ""
        )}

        <div className="grid grid-cols-2   md:grid-cols-3 gap-3 p-5 ">
          {respuestas.map(
            ({
              r_id_repuesta,
              r_opcion,
              r_correcta,
              r_estado,
              r_eliminado,
            }) => (
              <div
                key={r_id_repuesta}
                className="bg-blue-gray-50 h-auto shadow-2xl rounded-2xl"
              >
                <div className="bg-zinc-900 text-black  rounded-2xl">
                  <div className="mx-auto">
                    <div className="text-center mt-4 bg-blue-gray-50">
                      <textarea
                        className="border p-2  rounded-sm font-bold bg-blue-gray-50"
                        value={r_opcion}
                      />
                    </div>
                    {/* 
                    <div className="w-full p-4">
                      <input
                        className="w-full text-lg bg-blue-gray-50 font-semibold	text-blue-gray-800 "
                        disabled
                        value={r_opcion}
                      />
                    </div>
                    */}
                    <div className="w-auto flex ml-2 mb-2">
                      <Chip
                        variant="ghost"
                        size="sm"
                        color={r_correcta ? "green" : "red"}
                        value={r_correcta ? "Correcta" : "Incorrecta"}
                      />
                    </div>

                    <div className="w-auto flex ml-2 mb-2">
                      <Chip
                        variant="ghost"
                        size="sm"
                        color={r_estado ? "green" : "red"}
                        value={r_estado ? "Habilitado" : "Inhabilitado"}
                      />
                    </div>

                    <div className="p-2 flex justify-end mb-0">
                      <Tooltip content="Editar respuesta">
                        <button className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer">
                          <PencilIcon className="w-7" color="white" />
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
            onClick={() => setOpenNew(true)}
          >
            <Tooltip content="Crear una respuesta">
              <PlusCircleIcon
                color="white"
                className="mx-auto items-center text-center"
              />
            </Tooltip>
          </div>
        </div>

        {/* 
        <div className="flex items-center">
          <Typography className="text-lg font-bold" color="black">
            Tiempo disponible para memorizar la imagen (segundos):
          </Typography>
          <input
            className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
            type="number"
          />
        </div>
        */}
      </CardBody>

      <CardFooter className="pt-0">
        {/*         <Button variant="gradient" fullWidth color="green">
          Crear Pregunta
        </Button>
        */}
      </CardFooter>
    </Card>
  );
}
