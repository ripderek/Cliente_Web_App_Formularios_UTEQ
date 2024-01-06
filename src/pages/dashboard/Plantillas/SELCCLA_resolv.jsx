import { useEffect, useState, useRef } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets";
import axios from "axios";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import { TiempoAgotado } from "@/widgets";

export default function SELCCLA_resolv({
  id_pregunta,
  id_progreso_sec,
  RegresarProgresoSeccion,
  ProgresoPregunta,
}) {
  const [load, setLoader] = useState(false);
  const [data_user, setData_User] = useState([]);
  const [IDPregunta, setIdPregunta] = useState(null);
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
      //alert("Editando por ID");
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
      setSegundos(data.r_tiempo_segundo);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //{PARA LOS SEGUNDOS DE LA PREGUNTA}
  const [VerRespuestas, setVerRespuestas] = useState(null);

  const [segundos, setSegundos] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSegundos((prevSegundos) => {
        if (prevSegundos === 1) {
          // Si llegamos a cero, detenemos el temporizador y ocultamos el div
          clearInterval(intervalId);
          setVerRespuestas(false);
          enviarRespuesta();
        }
        return prevSegundos - 1;
      });
    }, 1000);

    // Limpieza del temporizador cuando el componente se desmonta o cuando la variable cambia
    return () => clearInterval(intervalId);
  }, [VerRespuestas]); // el segundo argumento vacío garantiza que el efecto se ejecute solo una vez al montar el componente

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
  //Si el tiempo termino registrar respuesta por default con el id del progreso_pregunta
  const [tiempoAgotado, setTiempoAgotado] = useState(false);
  const enviarRespuesta = () => {
    setTiempoAgotado(true);
    //  {{{{{{{{{{{{{{{{{{{{{{{{{PETICION AXIOS PARA REGISTRAR LA RESPUESTA}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

    //setTiempoAgotado(false);
    //cuando finalice volver a ProgresoSecciones
    Enviar_Respuesta("NA");
    //setData_User(null);
    //RegresarProgresoSeccion(true);

    //cuando finalice volver a carga la ultima pregunta
    //click();
  };

  //FUNCION DE SELECCIONAR LA RESPUESTA
  const seleccionRepuesta = (opcion) => {
    //alert(opcion);
    Enviar_Respuesta(opcion);
    //  {{{{{{{{{{{{{{{{{{{{{{{{{PETICION AXIOS PARA REGISTRAR LA RESPUESTA}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
    //setData_User(null);
    //RegresarProgresoSeccion(true);
    //click();
  };
  const Enviar_Respuesta = async (respuesta) => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/RegistrarPreguntaUnica",
        {
          p_id_progreso_pregunta: ProgresoPregunta,
          p_respuesta: respuesta,
          p_tiempo_respuesta: segundos,
        },
        {
          withCredentials: true,
        }
      );
      //setLoader(false);
      RegresarProgresoSeccion(true);
    } catch (error) {
      console.log(error);
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      //alert("Hubo un error");
      RegresarProgresoSeccion(true);
      console.log(error);
      //alert(error.response.data.error);
    }
  };
  return (
    <Card className="w-auto rounded-none mx-auto">
      {tiempoAgotado && <TiempoAgotado />}
      {load && <Loader />}
      <Alert
        color={segundos <= 5 ? "red" : segundos <= 10 ? "yellow" : "green"}
        icon={<ClockIcon className="h-10" />}
        className="fixed top-4 right-24 md:right-96 z-1 w-auto"
        open={true}
      >
        <Typography variant="h3" color="white">
          {segundos}
        </Typography>
      </Alert>

      <CardBody className="flex flex-col gap-4">
        {/* 
        <Typography variant="h4" color="orange">
          <p>Tiempo pregunta: {segundos} segundos</p>
        </Typography>
        <Typography variant="h4" color="orange">
          <p>Tiempo respues: {segundosRespuestas} segundos</p>
        </Typography>
        */}
        <Typography variant="h4" color="orange">
          Pregunta:
        </Typography>

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
        <div>
          <Typography variant="h4" color="orange">
            Opciones:
          </Typography>
          <div className="grid grid-cols-1 p-0 mt-1">
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
                  className="bg-white h-2/3 shadow-sm rounded-none cursor-pointer hover:shadow-yellow-900 hover:border-yellow-900 hover:border-4 border-2 border-green-700"
                  onClick={() => seleccionRepuesta(r_opcion)}
                >
                  <div className="bg-zinc-900 text-black  rounded-2xl">
                    <div className="mx-auto">
                      <div className="p-5">
                        {r_opcion}
                        {/* 
                        <textarea
                          className="border p-2 rounded-sm font-bold w-full h-full mt-3"
                          value={r_opcion}
                          disabled
                          readOnly
                        />
                        */}
                        {/*
                        <img
                          src={
                            process.env.NEXT_PUBLIC_ACCESLINK +
                            "preguntas/Ver_ImagenRespuestaMEMRZAR/" +
                            r_id_repuesta
                          }
                          alt={r_id_repuesta}
                          className="mt-3 h-64 w-auto mx-auto mb-6"
                        />
                        */}
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
                      <div className="w-auto flex ml-2 mb-2">{/** */}</div>

                      <div className="w-auto flex ml-2 mb-2">{/** */}</div>
                      {/* 
                    <div className="p-2 flex justify-end">
                      <Tooltip content="Editar respuesta">
                        <button className="bg-zinc-50 p-2 bg-green-700 rounded-xl cursor-pointer">
                          <PencilIcon className="w-7" color="white" />
                        </button>
                      </Tooltip>
                    </div>
                    */}
                    </div>
                  </div>
                </div>
              )
            )}
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
