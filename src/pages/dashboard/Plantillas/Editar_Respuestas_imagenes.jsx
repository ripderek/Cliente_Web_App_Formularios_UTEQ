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
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { AiOutlineUpload } from "react-icons/ai";
import {
  PencilIcon,
  PlusCircleIcon,
  XCircleIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function Editar_Respuestas_imagenes({
  cerrarEditarResp,
  IdRespuestaEdit,
  estadoCheck,
}) {
  const [load, setLoader] = useState(false);
  //img preview
  const [isChecked, setIsChecked] = useState(estadoCheck);
  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };
  //para la carga de imagenes
  const cerrar1 = (valor) => {
    setError(valor);
  };
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
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
  const CambiarImagenPregunta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const form = new FormData();
      form.set("file", fileenunciado);
      form.set("p_id_respuesta", IdRespuestaEdit);
      form.set("_correcta", isChecked);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/ActualizarImagenRespuesta",
        form,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      // obtener_datos_pregunta();
      setFilePenunciadoAUX(filePenunciado);
      setFilePenunciado(null);
      setImagenCambiada(true);
      cerrarEditarResp();
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
  //Cambiar Estado del correcto de la respuesta
  const Cambiar_estaod_correcto = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "preguntas/Editar_estadp_correcto_incorrecto_respuesta",
        {
          p_id_respuesta: IdRespuestaEdit,
          _correcta: isChecked,
        },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      //agregar_seccion();
      //setDeseaEliminar(false);
      //obtener_datos_pregunta();
      cerrarEditarResp();
    } catch (error) {
      setLoader(false);
      console.log(error);
      //colocar una alerta de error cuando no se pueda inciar sesion
      setMensajeError(error.response.data.message);
      //alert(error.response.data.error);
      setError(true);
    }
  };

  //Use Effet para
  return (
    <>
      {load ? <Loader /> : ""}
      {error && (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al llenar el formulario"
          cerrar={cerrar1}
        />
      )}
      <Dialog open={true} handler={cerrarEditarResp}>
        <DialogBody>
          <Typography variant="h4" color="blue-gray">
            Editar opcion de respuesta
          </Typography>

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
                "preguntas/Ver_ImagenRespuestaMEMRZAR/" +
                IdRespuestaEdit
              }
              alt="Imagen"
              className="mt-3 h-64 w-auto mx-auto"
            />
          )}
          {/* SI LA IMAGEN CAMBIO ENTONCES MOSTRAR EL BOTON DE GUARDAR NUEVA IMAGEN */}
          {filePenunciado ? (
            <div className="mx-auto items-center text-center">
              <div className=" flex ">
                <Button
                  className="bg-zinc-50 p-2 bg-green-600 rounded-xl cursor-pointer mx-auto"
                  onClick={() => CambiarImagenPregunta()}
                >
                  Guardar Cambio
                </Button>
                <Button
                  className="bg-zinc-50 p-2  bg-red-700 rounded-xl cursor-pointer mx-auto"
                  onClick={() => (
                    setFilePenunciado(null), setImagenCambiada(false)
                  )}
                >
                  Cancelar Cambio
                </Button>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-56 bg-yellow-800 p-2 rounded-xl">
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
            onClick={cerrarEditarResp}
          >
            <XCircleIcon className="w-11" color="orange" />
          </IconButton>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="green"
            onClick={Cambiar_estaod_correcto}
          >
            Aceptar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
