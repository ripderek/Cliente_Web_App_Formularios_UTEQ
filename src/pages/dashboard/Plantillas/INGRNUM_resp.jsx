import { useEffect, useState, useRef } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Checkbox,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { AiOutlineUpload } from "react-icons/ai";
import {
  PencilIcon,
  XCircleIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Editar_parametros_preguntas,
  Editar_Respuestas_imagenes,
  SELCCMA_edit_resp,
  SELCCLA_edit_resp,
} from "@/pages/dashboard/Plantillas";
export default function INGRNUM_resp({
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
  const [EstadoCheckEdit, setEditEstadoCheck] = useState(false);

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
        setLoader(false);
        console.log(data);
        setIdPregunta(data.r_id_pregunta);
        cargarRespuestas(data.r_id_pregunta);
        SetidPreguntaEdit(data.r_id_pregunta);
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
        setLoader(false);
        setIdPregunta(data.r_id_pregunta);
        cargarRespuestas(data.r_id_pregunta);
        SetidPreguntaEdit(data.r_id_pregunta);
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
      form.set("p_correcta", isChecked);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "preguntas/Crear_respuestaMEMRZAR",
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
  //para editar los parametros de la pregunta
  const [editarPregunta, setEditarPregunta] = useState(false);
  const [idPreguntaEdit, SetidPreguntaEdit] = useState(0);
  const CerrarEdit = () => {
    setEditarPregunta(false);
    obtener_datos_pregunta();
  };
  //para editar las respuestas
  const [editRespuesta, setEditRespuesta] = useState(false);
  const [idRespuestaEdit, SetidRespuestaEdit] = useState(0);
  const CerrarEditRespuesta = () => {
    setEditRespuesta(false);
    obtener_datos_pregunta();
  };
  //PARA LA IMAGEN DEL ENUNCIADO SKERE MODO DIABLO
  const [ImagenCambiad, setImagenCambiada] = useState(false);
  //para editar la imagen del enunciado
  //img preview
  const [fileenunciado, setFileenunciado] = useState(null);
  const [filePenunciado, setFilePenunciado] = useState();
  const [filePenunciadoAUX, setFilePenunciadoAUX] = useState();
  const [DeseaEliminar, setDeseaEliminar] = useState(false);
  const ImagePreviewenunciado = (e) => {
    try {
      setFileenunciado(e.target.files[0]);
      setFilePenunciado(URL.createObjectURL(e.target.files[0]));
      setImagenCambiada(true);
    } catch (error) {
      console.log(error);
    }
  };
  const fileInputRefenunciado = useRef(null);

  const handleButtonClickenunciado = () => {
    if (fileInputRefenunciado.current) {
      fileInputRefenunciado.current.click(); // Activa el input de tipo "file"
    }
  };
  //Funcion para cambiar la imagen de una pregunta skere modo diablo
  const CambiarImagenPregunta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const form = new FormData();
      form.set("file", fileenunciado);
      form.set("p_id_pregunta_creada", id_pregunta);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/ActualizarImagenPregunta",
        form,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      obtener_datos_pregunta();
      setFilePenunciadoAUX(filePenunciado);
      setFilePenunciado(null);
      setImagenCambiada(true);
      //se manda 0 como id porque se desconoce el id de la pregunta que se creo, y se envia true como segundo parametro para que relize la busqueda de la ultima pregunta en la sigueinte ventana en un useEffect
    } catch (error) {
      console.log(error);
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.message);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  return (
    <Card className="w-auto mx-auto rounded-none">
      {editRespuesta && (
        <SELCCLA_edit_resp
          Numerico={"sssss"}
          cerrar={() => (setEditRespuesta(false), cargarRespuestas(IDPregunta))}
          idpregunta={idRespuestaEdit}
          //estadoCheck={EstadoCheckEdit}
        />
      )}
      {load ? <Loader /> : ""}
      {error && (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      )}
      {editarPregunta && (
        <Editar_parametros_preguntas
          idpregunta={idPreguntaEdit}
          cerrar={CerrarEdit}
          TieneTiempoEnunciado={false}
          TieneTiempoRespuesta={true}
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
          <div className="flex">
            <Typography variant="h4" color="orange">
              Pregunta:
            </Typography>
            <div className=" ml-2 flex justify-end mb-0">
              <Tooltip content="Editar pregunta">
                <button
                  className="bg-zinc-50 p-2 bg-orange-500 rounded-xl cursor-pointer"
                  onClick={() => setEditarPregunta(true)}
                >
                  <PencilIcon className="w-4" color="white" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Tooltip content="Regresar">
              <Button
                variant="outlined"
                size="sm"
                color="orange"
                onClick={() => AbrirPreguntas(idni, nombrenivel)}
              >
                <ArrowLeftOnRectangleIcon strokeWidth={2} className="h-6 w-6" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <textarea
          className="border p-2  rounded-sm font-bold"
          size="lg"
          value={data_user.r_enunciado}
        />

        {ImagenCambiad ? (
          filePenunciado ? (
            <img
              src={filePenunciado}
              alt="Imagen"
              className="mt-3 h-64 w-auto mx-auto"
            />
          ) : (
            <img
              src={filePenunciadoAUX}
              alt="Imagen"
              className="mt-3 h-64 w-auto mx-auto"
            />
          )
        ) : (
          <img
            src={
              process.env.NEXT_PUBLIC_ACCESLINK +
              "preguntas/Ver_ImagenPregunta/" +
              data_user.r_id_pregunta
            }
            alt="Imagen"
            className="mt-3 h-64 w-auto mx-auto"
          />
        )}

        {/* SI LA IMAGEN CAMBIO ENTONCES MOSTRAR EL BOTON DE GUARDAR NUEVA IMAGEN */}
        {filePenunciado ? (
          <div className=" flex mx-auto">
            <Button
              className="bg-zinc-50 p-2 bg-green-600 rounded-xl cursor-pointer"
              onClick={() => CambiarImagenPregunta()}
            >
              Guardar Cambio
            </Button>
            <Button
              className="bg-zinc-50 p-2 ml-3 bg-red-700 rounded-xl cursor-pointer"
              onClick={() => (
                setFilePenunciado(null), setImagenCambiada(false)
              )}
            >
              Cancelar Cambio
            </Button>
          </div>
        ) : (
          <div className="mx-auto bg-yellow-800 p-2 rounded-xl">
            <label htmlFor="fileInput" className="text-white font-bold ">
              Cambiar imagen:
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={ImagePreviewenunciado}
              accept="image/png, .jpeg"
              className="hidden"
              ref={fileInputRefenunciado}
            />
            <Button
              className="ml-3  rounded-xl  bg-white h-11"
              onClick={handleButtonClickenunciado}
            >
              <AiOutlineUpload size="25px" color="black" />
            </Button>
          </div>
        )}

        {/* */}

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
            }) => (
              <div
                key={r_id_repuesta}
                className="bg-blue-gray-50 h-auto shadow-2xl rounded-2xl"
              >
                <div className="bg-zinc-900 text-black  rounded-2xl">
                  <div className="mx-auto">
                    <div className="text-center p-4">
                      <Typography
                        variant="h5"
                        color="black"
                        className="mx-auto"
                      >
                        {r_opcion}
                      </Typography>
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
                        <button
                          className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer"
                          onClick={() => (
                            setEditEstadoCheck(r_correcta),
                            SetidRespuestaEdit(r_id_repuesta),
                            setEditRespuesta(true)
                          )}
                        >
                          <PencilIcon className="w-7" color="white" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          {/* PARA ESTE TIPO DE PREGUNTA SOLO SE ADMITE UNA OPCION COMO CORRECTA PORQUE ES DE TIPO INPUT */}
          {/* 
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
          */}
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
        <Typography className="text-sm font-bold opacity-30" color="blue-gray">
          INGRNUM_edit.... pregunta: {id_pregunta}
        </Typography>
      </CardFooter>
    </Card>
  );
}
