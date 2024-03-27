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
  ArrowLeftOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Editar_parametros_preguntas,
  Editar_Respuestas_OPCLAVA,
} from "@/pages/dashboard/Plantillas";

export default function OPCLAVA_resp({
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
        setIdPregunta(data.r_id_pregunta);
        cargarRespuestas(data.r_id_pregunta);
        cargarCLaves(data.r_id_pregunta);
        SetidPreguntaEdit(data.r_id_pregunta);
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
    try {
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
    } catch (error) {
      alert("Error");
      console.log(error);
    }
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
    setClaves1({
      ...claves1,
      r_id_clave: data[0].r_id_clave,
      r_clave: data[0].r_clave,
    });
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
  const [claves1, setClaves1] = useState({
    r_id_clave: "",
    r_clave: "",
    r_valor: "",
  });
  //para editar los parametros de la pregunta
  const [editarPregunta, setEditarPregunta] = useState(false);
  const [idPreguntaEdit, SetidPreguntaEdit] = useState(0);
  const CerrarEdit = () => {
    setEditarPregunta(false);
    obtener_datos_pregunta();
  };
  //CAMBIAR LA IMAGEN DEL ENUNCIADO
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
  const [ImagenCambiad, setImagenCambiada] = useState(false);

  //para editar las respuestas
  const [editRespuesta, setEditRespuesta] = useState(false);
  const [idRespuestaEdit, SetidRespuestaEdit] = useState(0);
  //para el valor de la opcion Valor ya que es otra tabla, para no andar consultando en la BD
  const [idValor, setIdValor] = useState(0);
  const CerrarEditRespuesta = () => {
    setEditRespuesta(false);
    obtener_datos_pregunta();
  };
  const [EstadoCheckEdit, setEditEstadoCheck] = useState(false);
  //Funcion para eliminar una respuesta
  const EliminarRespuesta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/EliminarRespuesta/" +
          idRespuestaEdit,
        "",
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      //agregar_seccion();
      setDeseaEliminar(false);
      obtener_datos_pregunta();
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
    <Card className="w-auto mx-auto rounded-none">
      {load ? <Loader /> : ""}
      {error && (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      )}
      {/* PARA ELIMINAR UNA RESPUESTA*/}
      <Dialog open={DeseaEliminar}>
        <DialogHeader>Eliminar respuesta</DialogHeader>
        <DialogBody>
          ¿Esta seguro que desea eliminar la respuesta? Esta acción no se puede
          revertir
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDeseaEliminar(false)}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => EliminarRespuesta()}
          >
            <span>Aceptar</span>
          </Button>
        </DialogFooter>
      </Dialog>
      {/* Para editar los parametros de la pregunta */}
      {editarPregunta && (
        <Editar_parametros_preguntas
          idpregunta={idPreguntaEdit}
          cerrar={CerrarEdit}
          TieneTiempoEnunciado={true}
          TieneTiempoRespuesta={true}
        />
      )}
      {/* PARA EDITAR UNA REPUESTA */}
      {editRespuesta && (
        <Editar_Respuestas_OPCLAVA
          cerrarEditarResp={() => (
            setEditRespuesta(false), cargarRespuestas(IDPregunta)
          )}
          IdRespuestaEdit={idRespuestaEdit}
          estadoCheck={EstadoCheckEdit}
          id_valor={idValor}
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
              label={claves1.r_clave}
              name="r_valor"
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
              r_id_valor,
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
                        <button
                          className="bg-zinc-50 p-2 bg-orange-500 rounded-xl cursor-pointer"
                          onClick={() => (
                            setEditEstadoCheck(r_correcta),
                            SetidRespuestaEdit(r_id_repuesta),
                            setIdValor(r_id_valor),
                            setEditRespuesta(true)
                          )}
                        >
                          <PencilIcon className="w-4" color="white" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Eliminar respuesta">
                        <button
                          className="bg-zinc-50 p-2 bg-red-900 rounded-xl cursor-pointer ml-1"
                          onClick={() => (
                            SetidRespuestaEdit(r_id_repuesta),
                            setDeseaEliminar(true)
                          )}
                        >
                          <TrashIcon className="w-4" color="white" />
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
            onClick={() => (setOpenNew(true), console.log(Claves))}
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
        <Typography className="text-sm font-bold opacity-30" color="blue-gray">
          OPCLAVA_edit.... pregunta: {id_pregunta}
        </Typography>
      </CardFooter>
    </Card>
  );
}
