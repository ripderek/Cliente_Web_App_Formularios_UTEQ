import { useEffect, useState, useRef } from "react";
import { Dialog_Error, Loader, Notification } from "@/widgets";
import axios from "axios";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Alert,
  Input,
  Button,
} from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import { TiempoAgotado } from "@/widgets";

export default function OPCLAV2_resolv({
  id_pregunta,
  id_progreso_sec,
  RegresarProgresoSeccion,
  ProgresoPregunta,
}) {
  const [load, setLoader] = useState(false);
  const [data_user, setData_User] = useState([]);
  const [IDPregunta, setIdPregunta] = useState(null);
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
      setSegundosRespuestas(data.r_tiempo_respuesta);
      setSegundos(data.r_tiempo_enunciado);
      cargarCLaves(id_pregunta);
      setPreguntaCargada(true); // Marca la pregunta como cargada
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //PARA LAS CLAVES DE LOS INPUT
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
      r_id_clave1: data[1].r_id_clave,
      r_clave1: data[1].r_clave,
    });
  };
  const [claves1, setClaves1] = useState({
    r_id_clave: "",
    r_clave: "",
    r_valor: "",
    //2da parte
    r_id_clave1: "",
    r_clave1: "",
    r_valor1: "",
  });
  ////
  //{PARA LOS SEGUNDOS DE LA PREGUNTA}
  const [segundos, setSegundos] = useState(0);
  const [VerPregunta, SetVerPregunta] = useState(true);
  useEffect(() => {
    if (preguntaCargada && respuestasCargadas) {
    const intervalId = setInterval(() => {
      setSegundos((prevSegundos) => {
        if (prevSegundos === 1) {
          // Si llegamos a cero, detenemos el temporizador y ocultamos el div
          clearInterval(intervalId);
          SetVerPregunta(false);
          setVerRespuestas(true);
        }
        return prevSegundos - 1;
      });
    }, 1000);

    // Limpieza del temporizador cuando el componente se desmonta o cuando la variable cambia
    return () => clearInterval(intervalId);
    }
  }, [IDPregunta,preguntaCargada, respuestasCargadas]); // el segundo argumento vacío garantiza que el efecto se ejecute solo una vez al montar el componente
  //timer para ver las respuestas
  const [VerRespuestas, setVerRespuestas] = useState(null);

  const [segundosRespuestas, setSegundosRespuestas] = useState(-1);
  const intervalRef1 = useRef(null);
  //{USEEFECT PARA VER LAS RESPUESTAS}
  useEffect(() => {
    if (preguntaCargada && respuestasCargadas) {
    // Iniciar el temporizador solo cuando IDPregunta cambia
    if (VerRespuestas) {
      intervalRef1.current = setInterval(() => {
        setSegundosRespuestas((prevSegundos1) => {
          if (prevSegundos1 === 1) {
            // Si llegamos a cero, detenemos el temporizador y realizamos la acción
            clearInterval(intervalRef1.current);
            setVerRespuestas(false);
            //alert("Seg: " + prevSegundos1);
            //return;
          }
          return prevSegundos1 - 1;
        });
      }, 1000);
    }

    // Limpiar el temporizador cuando IDPregunta cambia o cuando el componente se desmonta
    return () => clearInterval(intervalRef1.current);
    }
  }, [VerRespuestas, preguntaCargada, respuestasCargadas]);

  //useffect para detener el timer de ver respuestas y enviar la repuesta xd
  useEffect(() => {
    // Iniciar el temporizador solo cuando IDPregunta cambia
    if (segundosRespuestas === 0) {
      clearInterval(intervalRef1.current);
      enviarRespuesta();
    }
  }, [VerRespuestas]);

  //return () => clearInterval(temporizador); // Limpiar el temporizador cuando el componente se desmonta

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
    setRespuestasCargadas(true); // Marca las respuestas como cargadas
    setLoader(false);
  };
  //Si el tiempo termino registrar respuesta por default con el id del progreso_pregunta
  const [tiempoAgotado, setTiempoAgotado] = useState(false);
  const enviarRespuesta = () => {
    setTiempoAgotado(true);
    //  {{{{{{{{{{{{{{{{{{{{{{{{{PETICION AXIOS}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

    //setTiempoAgotado(false);
    //cuando finalice volver a ProgresoSecciones
    Enviar_Respuesta("NA");
    //setData_User(null);
    //cuando finalice cargar la siguiente pregunta
    //click();
  };

  //FUNCION DE SELECCIONAR LA RESPUESTA
  const seleccionRepuesta = (opcion) => {
    //alert(opcion);
    setVerRespuestas(false);
    Enviar_Respuesta(opcion);
    //  {{{{{{{{{{{{{{{{{{{{{{{{{PETICION AXIOS}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
    //setData_User(null);
    // RegresarProgresoSeccion(true);
    //click();
  };

  //funcion para guardar la repuesta en la pregunta
  /* [ESTA FUNCION PUEDE SERVIR PARA ENVIAR LA REPUESTA A LA API] */

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
          p_tiempo_respuesta: segundosRespuestas,
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
      //alert(error.response.data.error);
      /*if (error.response.data.error===Ha ocurrido un error en la transacción principal: duplicate key value violates unique constraint "UQ_Repuestas_Preguta_progreso")
       */
    }
  };
  //Enviar respuestas con JSON
  //RegistrarRespuestasCLAVEVALOR1
  const Enviar_Respuesta_JSON = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);

    //Si hay datos entonces enviar el jSON de lo contrario enviar NA
    if (datos.length !== 0) {
      try {
        const result = await axios.post(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "test/RegistrarRespuestasCLAVEVALOR1",
          {
            p_id_progreso_pregunta: ProgresoPregunta,
            p_respuesta: datos,
            p_tiempo_respuesta: segundosRespuestas,
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
        //alert(error.response.data.error);
        /*if (error.response.data.error===Ha ocurrido un error en la transacción principal: duplicate key value violates unique constraint "UQ_Repuestas_Preguta_progreso")
         */
      }
    } else {
      alert("NO Hay seleccionados");

      try {
        const result = await axios.post(
          process.env.NEXT_PUBLIC_ACCESLINK + "test/RegistrarPreguntaUnica",
          {
            p_id_progreso_pregunta: ProgresoPregunta,
            p_respuesta: "NA",
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
        //alert(error.response.data.error);
      }
    }
  };

  //EXAMINAR ESTO PARA PODER ADJUNTAR EL CLAVE VALOR DE LAS REPUESTAS MIENTRAS SE INGRESA SKERE MODO DIABLO
  const [datos, setDatos] = useState([]);
  //funcion para almacenar la data en el array de datos
  const agregarDato = (e, opcion, index, id, id2) => {
    setDatos((prevDatos) => {
      const indiceExistente = prevDatos.findIndex(
        (dato) => dato.index === index
      );

      if (indiceExistente !== -1) {
        // Si el índice ya está registrado, actualizar el valor
        return prevDatos.map((dato, i) =>
          i === indiceExistente
            ? {
                ...dato,
                [e.target.name]: e.target.value,
              }
            : dato
        );
      } else {
        // Si el índice no está registrado, agregar uno nuevo
        return [
          ...prevDatos,
          {
            [e.target.name]: e.target.value,
            index: index,
            opcion: opcion,
            id_clave: id,
            id_clave1: id2,
          },
        ];
      }
    });
  };

  /*
  const agregarDato = (e, opcion, index) => {
    setDatos([
      ...datos,
      //el valor que el usuario le va a dar
      {
        [e.target.name]: e.target.value,
        //el index del mapeo --> servira para poder identificarlo y cambiarlo si ya esta ingresado
        index: index,
        //la opcion es decir la URL de la IMGEN en este caso
        opcion: opcion,
      },
    ]);
    console.log(datos);
  };
*/
  return (
    <Card className="w-auto rounded-none mx-auto">
      {tiempoAgotado && <TiempoAgotado />}
      {load && <Loader />}
      {VerPregunta && (
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
      )}
      {VerRespuestas && (
        <Alert
          color={
            segundosRespuestas <= 5
              ? "red"
              : segundosRespuestas <= 10
              ? "yellow"
              : "green"
          }
          icon={<ClockIcon className="h-10" />}
          className="fixed top-4 right-24 md:right-96 z-1 w-auto"
          open={true}
        >
          <Typography variant="h3" color="white">
            {segundosRespuestas}
          </Typography>
        </Alert>
      )}

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
          className="border p-2  rounded-sm font-bold  h-auto "
          size="lg"
          style={{ height: "fit-content" }}
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
        {VerPregunta && (
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

        {VerRespuestas && (
          <div>
            <div className="flex justify-end items-center">
              <Button
                onClick={() => Enviar_Respuesta_JSON()}
                //datos
                // onClick={() => console.log(datos)}
                color="green"
                className="rounded-none"
              >
                Enviar Respuestas
              </Button>
            </div>
            <Typography variant="h4" color="orange">
              Opciones:
            </Typography>
            <div className="grid grid-cols-4   md:grid-cols-5 gap-3 p-5">
              {respuestas.map(
                (
                  {
                    r_id_repuesta,
                    r_opcion,
                    r_correcta,
                    r_estado,
                    r_eliminado,
                  },
                  index
                ) => (
                  <div
                    key={r_id_repuesta}
                    className="bg-blue-gray-50 h-auto shadow-xl rounded-none cursor-text hover:shadow-yellow-900 border-green-900 border-4"
                    //onClick={() => seleccionRepuesta(r_opcion)}
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
                            className="mt-3 h-min w-min mx-auto mb-6"
                          />
                        </div>

                        <div className=" p-4">
                          <Input
                            className="min-w-min mx-auto items-center text-center"
                            type="text"
                            variant="outlined"
                            label={claves1.r_clave}
                            name="r_valor"
                            color="orange"
                            // valor={primerClave}
                            onChange={(e) =>
                              agregarDato(
                                e,
                                r_opcion,
                                index,
                                claves1.r_id_clave,
                                claves1.r_id_clave1
                              )
                            }
                          />
                          <Input
                            className="min-w-min mx-auto items-center text-center"
                            type="text"
                            variant="outlined"
                            label={claves1.r_clave1}
                            name="r_valor1"
                            color="orange"
                            // valor={primerClave}
                            onChange={(e) =>
                              agregarDato(
                                e,
                                r_opcion,
                                index,
                                claves1.r_id_clave,
                                claves1.r_id_clave1
                              )
                            }
                          />
                          {/**
                          <input
                            className=" w-full p-2 border  rounded-sm border-yellow-900 "
                            //value={r_opcion}
                          />
                           */}
                        </div>

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
        )}

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
