import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { useRouter } from "next/router";

export default function FormDatos() {
  //cargar los datos del participantes segun el token id de las coockies
  const [DatosParticipante, SetDatosParticipante] = useState([]);
  const [load, setLoader] = useState(false);
  useEffect(() => {
    Datos_Participante();
  }, []);
  const cookies = new Cookies();
  const router = useRouter();

  const Datos_Participante = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "participantes/DataParticipante/" +
          cookies.get("id_user"),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetDatosParticipante(data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //hacer una funcion para que registre al usuario en el test
  //estado para almacenar la info de la seccion
  const [registro_usuario_test, SetRegistro] = useState({
    p_token_id_participante: cookies.get("id_user"),
    p_token_id_test: cookies.get("token_test"),
    p_facultad: "",
    p_carrera: "",
    p_semestre: "",
  });
  const HandleChange = (e) => {
    SetRegistro({ ...registro_usuario_test, [e.target.name]: e.target.value });
    //console.log(registro_usuario_test);
  };
  //funcion para registrar y enviar a otra ruta donde cargaran las secciones y las preguntas
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  const cerrar1 = (valor) => {
    setError(valor);
  };
  //Funcion para registrar al participante en el test
  const Registrar_Participante = async () => {
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    try {
      //aqui hay que crear un procedimiento que genere todas las preguntas
      //que va a tener el usuario y las cree en una tabla
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/IngresoParticipanteTest",
        registro_usuario_test,
        {
          withCredentials: true,
        }
      );
      setLoader(false);
      //si todo salio bien reenviar a otro formulario donde cargaran las secciones del test
      router.push("/FormulariosOP/Test");
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
    <div className="mb-6">
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
      <Card
        color="transparent"
        shadow={false}
        className="mx-auto w-full max-w-[29rem] mt-3 shadow-xl p-6   text-center bg-white items-center justify-center mb-6 border-4 border-solid border-green-900 rounded-none"
      >
        <Typography variant="h4" color="blue-gray">
          Registrar en el Test
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Para continuar al test complete el siguiente formulario
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={DatosParticipante.r_nombres_apellidos}
              disabled
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={DatosParticipante.r_correo_institucional}
              disabled
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {/* 
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            */}
            <Input
              size="lg"
              placeholder="Facultad"
              name="p_facultad"
              onChange={HandleChange}
              className=" !border-yellow-800 focus:!border-green-600 rounded-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Input
              size="lg"
              placeholder="Carrera"
              onChange={HandleChange}
              name="p_carrera"
              className=" !border-yellow-800 focus:!border-green-600 rounded-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="flex">
              <div className="flex-grow ">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="-mb-3 text-center items-center justify-center mr-2 rounded-none"
                >
                  Semestre:
                </Typography>
              </div>
              <div className="flex-shrink">
                <Input
                  type="number"
                  max={10}
                  min={1}
                  maxLength={2}
                  minLength={1}
                  onChange={HandleChange}
                  name="p_semestre"
                  className=" !border-yellow-800 focus:!border-green-600 rounded-none"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
            </div>
          </div>
          {/* 
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree the
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          */}
          <Button
            className="mt-6 rounded-none"
            fullWidth
            color="orange"
            onClick={Registrar_Participante}
          >
            Aceptar
          </Button>
        </form>
      </Card>
    </div>
  );
}
