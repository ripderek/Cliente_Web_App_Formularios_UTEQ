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
  TrashIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { SELCCMA_edit, SELCCMA_edit_resp } from "@/pages/dashboard/Plantillas";
export default function SELCCMA_resp({
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
        //alert("Obtener datos pregunta true" + id_pregunta);

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
        SetidPreguntaEdit(data.r_id_pregunta);
      } else {
        //alert("Obtener datos pregunta false" + id_pregunta);
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
        SetidPreguntaEdit(id_pregunta);
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

    //alert("CARGAR pregutnaa" +value_id_pregunta);

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
    setLoader(false);
  };
  //estado para abrir el dialog para anadir una opcion de respuesta
  const [openNew, setOpenNew] = useState(false);
  const hanldeOpen = () => {
    setOpenNew(!openNew);
  };

  const [isChecked, setIsChecked] = useState(true);

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
  //para eliminar una respuesta
  const EliminarRespuesta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/EliminarRespuesta/" +
          id_respuesta,
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
  const [DeseaEliminar, setDeseaEliminar] = useState(false);
  const [id_respuesta, setIdrespuesta] = useState(0);
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
  return (
    <Card className="w-auto mt-6 mx-auto rounded-none">
      {editarPregunta && (
        <SELCCMA_edit idpregunta={idPreguntaEdit} cerrar={CerrarEdit} />
      )}
      {editRespuesta && (
        <SELCCMA_edit_resp
          idpregunta={idRespuestaEdit}
          cerrar={CerrarEditRespuesta}
        />
      )}
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
        <div className="bg-gray-50 h-auto shadow-none rounded-none border-2 border-orange-900">
          <div className="bg-zinc-900 text-black  rounded-2xl">
            <div className="mx-auto">
              <textarea
                className="border p-2 w-full  rounded-none font-bold bg-gray-50 border-none"
                value={data_user.r_enunciado}
              />
              <div className="p-2 flex justify-end mb-0">
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
          </div>
        </div>

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

        <div className="grid grid-cols-1   md:grid-cols-1 gap-3 p-5 ">
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
                className="bg-gray-50 h-auto shadow-none rounded-none border-2 border-green-900"
              >
                <div className="bg-zinc-900 text-black  rounded-2xl">
                  <div className="mx-auto">
                    <textarea
                      className="border p-2 w-full  rounded-none font-bold bg-gray-50 border-none"
                      value={r_opcion}
                    />
                    <div className="p-2 flex justify-end mb-0">
                      <Tooltip content="Editar respuesta">
                        <button
                          className="bg-zinc-50 p-2 bg-orange-500 rounded-xl cursor-pointer"
                          onClick={() => (
                            SetidRespuestaEdit(r_id_repuesta),
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
                            setIdrespuesta(r_id_repuesta),
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
            className="bg-green-600 shadow-2xl h-20 w-20 mt-3 rounded-2xl cursor-pointer mx-auto"
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
      </CardBody>
    </Card>
  );
}
