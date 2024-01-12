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

export default function OPCLAV2_resp({
  id_pregunta,
  buscar,
  id_nivel,
  nombrenivel,
  AbrirPreguntas,
  idni,
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
    try {
      if (buscar) {
        //alert("Buscando");
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "preguntas/MEMRZAR_Datos_pregunta/" +
            id_nivel,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const data = await response.json();
        setData_User(data);
        setIdPregunta(data.r_id_pregunta);
        cargarRespuestas(data.r_id_pregunta);
        cargarCLaves(data.r_id_pregunta);
      } else {
        //alert("Editando por ID");
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "preguntas/MEMRZAR_Datos_pregunta_id_pregunta/" +
            id_pregunta,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setData_User(data);
        setIdPregunta(data.r_id_pregunta);
        cargarRespuestas(data.r_id_pregunta);
        cargarCLaves(data.r_id_pregunta);
      }

      setLoader(false);
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
        "preguntas/Respuestas1CALVEVALOR/" +
        value_id_pregunta,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    setRespuestas(data);
    setLoader(false);
  };
  //funcion para cargar las claves de las preguntas
  const [Claves, SetClaves] = useState([]);
  const cargarCLaves = async (value_id_pregunta) => {
    setLoader(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_ACCESLINK +
        "preguntas/Obtener_Claves/" +
        value_id_pregunta,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    SetClaves(data);
    //en lugar de hacer dos filas mejor hacer una sola xd con r_clave1 r_valor1 para modificarlo mediante el index
    setClaves1([
      ...claves1,
      { r_id_clave: data[0].r_id_clave, r_clave: data[0].r_clave, r_valor: "" },
      { r_id_clave: data[1].r_id_clave, r_clave: data[1].r_clave, r_valor: "" },
    ]);

    //setClaves1({ ...claves1, r_clave: data[0].r_clave });

    /**
     *   r_id_clave:0,
    r_clave:"",
     */
    setLoader(false);
  };
  //estado para abrir el dialog para anadir una opcion de respuesta
  const [openNew, setOpenNew] = useState(false);
  const hanldeOpen = () => {
    setOpenNew(!openNew);
  };
  //para la carga de imagenes
  const fileInputRef = useRef(null);
  const cerrar1 = (valor) => {
    setError(valor);
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Activa el input de tipo "file"
    }
  };
  //img preview
  const [file, setFile] = useState(null);
  const [fileP, setFileP] = useState();
  const ImagePreview = (e) => {
    try {
      setFile(e.target.files[0]);
      setFileP(URL.createObjectURL(e.target.files[0]));
    } catch (error) {
      console.log(error);
    }
  };
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const HandleChange = (e) => {
    setClaves1({ ...claves1, [e.target.name]: e.target.value });
    console.log(claves1);
    //    setClaves1({ ...claves1, r_clave: data[0].r_clave });
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
      const form = new FormData();
      form.set("file", file);
      form.set("id_pregunta", IDPregunta);
      form.set("r_id_clave", claves1.r_id_clave);
      form.set("r_valor", claves1.r_valor);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/Crear_respuesta1ClaveValor",
        form,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
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
  const [claves1, setClaves1] = useState([]);
  return (
    <Card className="w-auto mt-6 mx-auto">
      {load ? <Loader /> : ""}
      {error && (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      )}
      {/* Para agregar una opcion de respuesta a la pregunta con imagen*/}
      <Dialog open={openNew} handler={hanldeOpen}>
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Agregar opcion de respuesta
          </Typography>

          <img
            src={!fileP ? "/img/Home/materia_icon.png" : fileP}
            alt="Imagen"
            className="mt-3 h-64 w-auto mx-auto"
          />
          <div className="mt-2">
            <div className="mx-auto w-48 bg-yellow-800 p-2 rounded-xl">
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
          </div>
          <div className="flex items-center mt-4">
            <Input
              className=" border-4 border-yellow-900"
              type="text"
              variant="outlined"
              label={claves1[0].r_clave}
              name="r_valor"
              color="orange"
              // valor={primerClave}
              onChange={HandleChange}
            />
            <Input
              className=" border-4 border-yellow-900"
              type="text"
              variant="outlined"
              label={claves1[1].r_clave}
              name="r_valor1"
              color="orange"
              // valor={primerClave}
              onChange={HandleChange}
            />
            {/* 
            <Typography className="text-lg font-bold" color="black">
              ¿Respuesta Correcta?: {Claves[0].r_clave}
            </Typography>
            <Checkbox
              color="green"
              checked={isChecked}
              onChange={handleChange}
            />
            */}
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
        <textarea
          className="border p-2  rounded-sm font-bold"
          size="lg"
          value={data_user.r_enunciado}
        />

        <img
          src={
            process.env.NEXT_PUBLIC_ACCESLINK +
            "preguntas/Ver_ImagenPregunta/" +
            data_user.r_id_pregunta
          }
          alt="Imagen"
          className="mt-3 h-64 w-auto mx-auto"
        />
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
        <div className="grid grid-cols-4   md:grid-cols-6 gap-3 p-5">
          {respuestas.map(
            ({
              r_id_repuesta,
              r_opcion,
              r_correcta,
              r_estado,
              r_eliminado,
              r_valor,
            }) => (
              <div
                key={r_id_repuesta}
                className="bg-blue-gray-50 h-auto shadow-2xl rounded-2xl"
              >
                <div className="bg-zinc-900 text-black  rounded-2xl">
                  <div className="mx-auto">
                    <div className="text-center">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_ACCESLINK +
                          "preguntas/Ver_ImagenRespuestaMEMRZAR/" +
                          r_id_repuesta
                        }
                        alt={r_id_repuesta}
                        className="mt-3 h-auto w-auto mx-auto mb-6"
                      />
                    </div>

                    <div className="w-full p-4">
                      <input
                        className="w-full text-lg bg-blue-gray-50 font-semibold	text-blue-gray-800 text-center"
                        disabled
                        value={r_valor}
                      />
                    </div>

                    <div className="w-auto flex ml-2 mb-2">
                      <Chip
                        variant="ghost"
                        size="sm"
                        color={r_correcta ? "green" : "red"}
                        value={r_correcta ? "Correcta" : "Incorrecta"}
                      />
                    </div>
                    {/* 
                    <div className="w-auto flex ml-2 mb-2">
                      <Chip
                        variant="ghost"
                        size="sm"
                        color={r_estado ? "green" : "red"}
                        value={r_estado ? "Habilitado" : "Inhabilitado"}
                      />
                    </div>
*/}
                    <div className="p-2 flex justify-end">
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
            onClick={() => (
              setOpenNew(true), console.log(Claves), console.log(claves1)
            )}
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
