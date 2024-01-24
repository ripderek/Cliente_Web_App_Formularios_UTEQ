import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useRef, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import axios from "axios";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

export default function SELCIMG({
  tipo_preg,
  id_nivel,
  icono,
  AbrirEditor,
  cambiarPestañas,
}) {
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  //variable para mostrar el loader cuando carga una peticion
  const [load, setLoader] = useState(false);
  const cerrar1 = (valor) => {
    setError(valor);
  };

  //img preview

  //funcion para guardar crear la pregunta en la base de datos
  //primero los estados que necesito definir para poder crearlos
  const [enunciado, setEnunciado] = useState("");
  const [tiempoRespuesta, setTiempoRes] = useState(0);
  //funcion para crear la pregunta
  const Crear_pregunta = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    console.log(
      enunciado + "-" + tiempoRespuesta + "-" + tipo_preg + "-" + id_nivel
    );
    try {
      //form.set("p_tiempo_img", timepoImg);

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "preguntas/CrearPreguntaSELCIMG",
        {
          p_enunciado: enunciado,
          p_tiempos_segundos: tiempoRespuesta,
          p_tipo_pregunta: tipo_preg,
          p_id_nivel: id_nivel,
        },
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      //se manda 0 como id porque se desconoce el id de la pregunta que se creo, y se envia true como segundo parametro para que relize la busqueda de la ultima pregunta en la sigueinte ventana en un useEffect

      //{IMPORTANTE CREAR ESTA FUNCION Y ESTE COMPONENTE}
      //AbrirEditarSELCIMG(0, true);
      AbrirEditor("SELCIMG", 0, true);
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
    <Card className="w-auto mt-6 mx-auto rounded-none">
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
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-1 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h4" color="orange">
              Seleccionar una opcion de tipo imagen
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="gradient"
              size="sm"
              color="orange"
              onClick={() => cambiarPestañas("openPreguntas")}
            >
              Regresar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Typography className="text-lg font-bold" color="black">
          Escriba el enunciado:
        </Typography>
        <textarea
          className="border p-2 border-yellow-900 rounded-sm"
          size="lg"
          onChange={(e) => setEnunciado(e.target.value)}
        />
        <div className="flex items-center">
          <Typography className="text-lg font-bold" color="black">
            Tiempo disponible para responder (segundos):
          </Typography>
          <input
            className="ml-6 w-16 p-2 border  rounded-sm border-yellow-900 "
            type="number"
            onChange={(e) => setTiempoRes(e.target.value)}
          />
        </div>
      </CardBody>

      <CardFooter className="pt-0">
        <Button
          variant="gradient"
          fullWidth
          color="green"
          onClick={Crear_pregunta}
        >
          Crear Pregunta
        </Button>
      </CardFooter>
    </Card>
  );
}
