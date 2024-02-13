import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  MagnifyingGlassIcon,
  NoSymbolIcon,
  LockOpenIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  PlusIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import Cookies from "universal-cookie";

export default function ProgresoSecciones({
  openQuestion,
  siguiente,
  r_id_progreso_seccion_p,
  id_sec_p,
  RegresarProgresoSeccion,
}) {
  const Router = useRouter();

  //hacer una funcion que cargue todo el progreso de las secciones del participantes
  const [progreso, setProgreso] = useState([]);
  const [load, setLoader] = useState(false);
  const cookies = new Cookies();
  const [dataTest, setDataTest] = useState([]);
  //const [userAgent, setuserAgent] = useState("");
  useEffect(() => {
    if (siguiente) click(r_id_progreso_seccion_p, id_sec_p);
    else obtener_Progreso();
  }, []);
  //funcion para cargar las secciones que tiene el usuario obteniendo su id de la cookie
  const obtener_Progreso = async () => {
    //auth/ObtenerIP

    setLoader(true);
    try {
      /////////
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/ProgresoSeccionesParticipante/" +
          cookies.get("id_user") +
          "/" +
          cookies.get("token_test"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setProgreso(data);
      //obtener los datos del test
      const response2 = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/TestDataTOken/" +
          cookies.get("token_test"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data2 = await response2.json();
      setDataTest(data2);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      console.log(error);
    }
  };
  //funcion que retorna a la interfaz principal toda la info necesaria como el id del progreso
  const [SiguientePre, SetSiguientePre] = useState([]);
  const click = async (r_id_progreso_seccion, id_sec) => {
    setLoader(true);
    //alert("Progreso Seccion: " + r_id_progreso_seccion + "IDSeccion" + id_sec);
    try {
      const response1 = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/HayMas/" +
          cookies.get("id_user") +
          "/" +
          cookies.get("token_test") +
          "/" +
          id_sec,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response1.ok) {
        const data1 = await response1.json();
        //alert("Response1.ok");
        //alert("data1.r_verification" + data1.r_verification);

        if (data1.r_verification) {
          const response = await fetch(
            process.env.NEXT_PUBLIC_ACCESLINK +
              "test/ProgresoPreguntasSeccion/" +
              cookies.get("id_user") +
              "/" +
              cookies.get("token_test") +
              "/" +
              id_sec,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          if (response.ok) {
            //alert("Response OK");
            const responseData = await response.text(); // Obtener el texto de la respuesta

            if (responseData.trim() !== "") {
              const data = JSON.parse(responseData);
              SetSiguientePre(data);

              if (data) {
                openQuestion(
                  r_id_progreso_seccion,
                  data.r_codigo,
                  data.r_id_pregunta,
                  data.r_id_progreso_preguntas,
                  id_sec
                );
              }
            } else {
              obtener_Progreso();
            }
          } else {
            obtener_Progreso();
          }
        } else {
          obtener_Progreso();
        }

        setLoader(false);
      } else {
        obtener_Progreso();
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      // Puedes manejar el error de otra manera si es necesario
    }
  };

  {
    /* 
  const click = async (r_id_progreso_seccion, id_sec) => {
    //aqui se necesita obtener la siguiente pregunta sin resolver del participante
    //id de la pregunta,
    //tipo de pregunta,
    //id_progreso_pregunta
    setLoader(true);
    try {
      const response1 = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/HayMas/" +
          cookies.get("id_user") +
          "/" +
          cookies.get("token_test") +
          "/" +
          id_sec,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data1 = await response1.json();
      if (data1.r_verification) {
        const response = await fetch(
          process.env.NEXT_PUBLIC_ACCESLINK +
            "test/ProgresoPreguntasSeccion/" +
            cookies.get("id_user") +
            "/" +
            cookies.get("token_test") +
            "/" +
            id_sec,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        SetSiguientePre(data);
        if (data) {
          openQuestion(
            r_id_progreso_seccion,
            data.r_codigo,
            data.r_id_pregunta,
            data.r_id_progreso_preguntas,
            id_sec
          );
        }
      } else obtener_Progreso();

      setLoader(false);
    } catch (error) {
      //obtener_Progreso();
      //setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      console.log(error);
      //hacer un reload a la paguina
      //Router.push("/FormulariosOP/Test");
    }
  };
  */
  }
  const [openAlert, setOpenAlert] = useState(false);
  const crear = (value) => {
    setOpenAlert(value);
  };
  const abrir = (value, r_id_progreso_seccion, r_id_seccion) => {
    //alert(r_id_progreso_seccion);
    if (value) setOpenAlert(true);
    else click(r_id_progreso_seccion, r_id_seccion);
  };
  return (
    <div>
      {load ? <Loader /> : ""}
      <Card className="h-full w-full rounded-none">
        <CardBody className="overflow-scroll px-0">
          <Notification
            mensaje="Ya se encuentra completa"
            abrir={openAlert}
            crear={crear}
          />
          <div className="ml-4 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                {dataTest.r_titulo}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                {dataTest.r_descripcion}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Secciones a Evaluar
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {/* 
            <Button variant="outlined" size="sm">
              Todo
            </Button>
           
              <Button
                className="flex items-center gap-3"
                size="sm"
                color="green"
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Crear Seccion
              </Button>
               */}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 ">
            {progreso.map(
              ({
                r_id_progreso_seccion,
                r_id_seccion,
                r_id_participante_test,
                r_estado_completado,
                r_bloqueado,
                r_porcentaje,
                r_titulo_seccion,
                r_descripcion_seccion,
              }) => (
                <div
                  key={r_id_progreso_seccion}
                  className="bg-blue-gray-50 shadow-2xl rounded-none  border-orange-500 border-4 border-solid cursor-pointer  hover:shadow-yellow-900"
                  onClick={() =>
                    abrir(
                      r_estado_completado,
                      r_id_progreso_seccion,
                      r_id_seccion
                    )
                  }
                >
                  <div className="bg-zinc-900 text-black shadow-2xl rounded-none">
                    <div className="mx-auto">
                      <div className="text-center">
                        <Avatar
                          src={"/img/Home/materia_icon.png"}
                          alt={r_titulo_seccion}
                          size="xl"
                          className="mt-3"
                        />
                      </div>
                      <div className="w-full p-4 mx-auto text-center">
                        <input
                          className="w-full text-lg bg-blue-gray-50 font-semibold	text-blue-gray-800 mx-auto text-center"
                          disabled
                          value={r_titulo_seccion}
                        />
                      </div>

                      {r_estado_completado ? (
                        <div className="w-auto flex ml-2 mb-2">
                          <Chip
                            variant="ghost"
                            size="sm"
                            color="green"
                            value="Completado"
                          />
                        </div>
                      ) : (
                        <div className="w-auto flex ml-2 mb-2">
                          <Chip
                            variant="ghost"
                            size="sm"
                            color="orange"
                            value="Incompleto"
                          />
                        </div>
                      )}

                      <div className="w-auto flex ml-2 mb-2">
                        <Chip
                          variant="ghost"
                          size="sm"
                          color="blue-gray"
                          //r_porcentaje +
                          value={r_porcentaje + "%"}
                          className=" text-2xl"
                        />
                      </div>

                      <div className="p-2 flex justify-end">
                        {r_bloqueado ? (
                          <Tooltip content="Seccion bloqueada">
                            <button
                              className="bg-zinc-50 p-2 bg-green-700 rounded-none cursor-pointer border-gray-50 border-4"
                              disabled
                            >
                              <LockClosedIcon className="w-7" color="white" />
                            </button>
                          </Tooltip>
                        ) : (
                          <Tooltip content="Seccion desbloqueada">
                            <button
                              className="bg-zinc-50 p-2 bg-green-700 rounded-none cursor-pointer border-gray-50 border-4"
                              disabled
                            >
                              <LockOpenIcon className="w-7" color="white" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          {/* 
          <Typography variant="small" color="blue-gray" className="font-normal">
            Pagina 1 de 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Anterior
            </Button>
            <Button variant="outlined" size="sm">
              Siguiente
            </Button>
          </div>
            */}
        </CardFooter>
      </Card>
    </div>
  );
}
