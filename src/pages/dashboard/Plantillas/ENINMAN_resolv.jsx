import { useEffect, useState, useRef } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets";
import axios from "axios";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Alert,
  Button,
} from "@material-tailwind/react";

export default function ENINMAN_resolv({
  id_pregunta,
  id_progreso_sec,
  RegresarProgresoSeccion,
  ProgresoPregunta,
}) {
  const [load, setLoader] = useState(false);
  const [data_user, setData_User] = useState([]);
  const [IDPregunta, setIdPregunta] = useState(null);
  const [segundos, setSegundos] = useState(100);

  const [respuesta, setRespuesta] = useState("");

  //estados para controlar si la pregunta y las respuestas se han cargado completamente
  const [preguntaCargada, setPreguntaCargada] = useState(false);
  const [respuestasCargadas, setRespuestasCargadas] = useState(false);
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
      //setSegundos(data.r_tiempo_segundo);
      setPreguntaCargada(true); // Marca la pregunta como cargada
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //{PARA LOS SEGUNDOS DE LA PREGUNTA}
  //const [VerRespuestas, setVerRespuestas] = useState(null);

  /*
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
*/

  const [respuestas, setRespuestas] = useState([]);
  //funcion para cargar todas las respuestas de una pregunta ENINMAN
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
    setRespuestasCargadas(true); // Marca las respuestas como cargadas
    setLoader(false);
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
    //alert(ProgresoPregunta + " ddd " + respuesta);

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
      setLoader(false);
      RegresarProgresoSeccion(true);
    } catch (error) {
      console.log(error);
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      //alert("Hubo un error");
      RegresarProgresoSeccion(true);
      console.log(error);
      alert(error.response.data.message);
    }
  };
  return (
    <Card className="w-auto rounded-none mx-auto">
      {load && <Loader />}

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
          <div className="flex justify-end items-center">
            <Button
              onClick={() => Enviar_Respuesta(respuesta)}
              color="green"
              className="rounded-none"
            >
              Enviar Respuestas
            </Button>
          </div>
          <Typography variant="h4" color="orange">
            Opciones:
          </Typography>
          <div className="grid grid-cols-1 p-0 mt-1">
            <div className="bg-white  h-full shadow-sm rounded-none border-2 border-green-700">
              <div className="bg-zinc-900 text-black  rounded-2xl">
                <div className="mx-auto">
                  <div className="">
                    <textarea
                      className="border p-2 rounded-sm font-bold w-full h-full m-0 "
                      rows={5} // Número de filas
                      cols={50} // Número de columnas
                      value={respuesta}
                      placeholder="Aquí escribe la respuesta"
                      onChange={(e) => setRespuesta(e.target.value)}
                    />
                  </div>
                  <div className="w-auto flex ml-2 mb-2">{/** */}</div>

                  <div className="w-auto flex ml-2 mb-2">{/** */}</div>
                </div>
              </div>
            </div>
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
