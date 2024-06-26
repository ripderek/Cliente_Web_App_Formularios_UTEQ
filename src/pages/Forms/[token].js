import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import Cookies from "universal-cookie";

//importar la barra de navegacion
import { NavBarFormsLogin } from "@/components/FormsLayout";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import alertGradient from "@material-tailwind/react/theme/components/alert/alertGradient";
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente
import Head from "next/head";
//not_exist.json   erroneo
import anim_not_exist from "../../../public/anim/not_exist.json";
import anim_erroneo from "../../../public/anim/erroneo.json";
import anim_reloj from "../../../public/anim/reloj.json";

import Lottie from "lottie-react";

export default function Formulario() {
  const router = useRouter();
  const { token } = router.query;
  const [load, setLoader] = useState(false);
  //para almacenar los datos del formulario
  const [DataForm, setDataForm] = useState([]);
  const [NotFound, setNotFound] = useState(true);
  //estado para habilitar el inicio de sesion con google
  const [EnableGoogle, setEnableGoogle] = useState(false);
  const cookies = new Cookies();
  //Mediante un usee effect obtener los datos del formulario enviando el token por URL de la API
  useEffect(() => {
    cookies.remove("id_user");
    cookies.remove("myTokenName");
    cookies.remove("token_test");
    if (token) {
      Consulta_Estado_Token(token);
      Datos_Formulario(token);
    }
  }, [token]);
  const [EstadoFormulario, SetEstadoFormulario] = useState(-1);
  //para verificar el estado del formulario segun el token que se ingrese
  const Consulta_Estado_Token = async (token3) => {
    setLoader(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "auth/estado_formulario_token/" +
          token3,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      SetEstadoFormulario(data.r_estado);
      console.log(data);
      //console.log(result.data);
      //Verificar si el token es vacio es xq no existe
      //ACTUALIZACION SI EL ESTADO ES = 0 ETONCES ACTIVAR EL INICIO DE SESION CON GOOGLE SKERE MODOD DIABLO
      if (data.r_estado === 0) {
        setNotFound(false);
        //como si hay data crear un switch para verificar si se puede iniciar sesion
        //con el switch si una varibale esta en falso deshbilita la funcion de iniicar sesion
        setEnableGoogle(true);
      }
      setLoader(false);
    } catch (error) {
      alert("Error");
      setLoader(false);
      console.log(error);
    }
  };

  const Datos_Formulario = async (token3) => {
    setLoader(true);
    const cookies = new Cookies();
    cookies.remove("id_user");
    cookies.remove("myTokenName");
    cookies.remove("token_test");
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK + "auth/DatosFormulario/" + token3,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      setDataForm(data);
      console.log(data);
      //console.log(result.data);
      //Verificar si el token es vacio es xq no existe
      /* 
      if (data) {
        setNotFound(false);
        //como si hay data crear un switch para verificar si se puede iniciar sesion
        //con el switch si una varibale esta en falso deshbilita la funcion de iniicar sesion
        setEnableGoogle(true);
      }
      */
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  /*
    //Envento clik para iniciar con google
    const loginG = useGoogleLogin({
        onSuccess: async (respose) => {
            try {
                const res = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${respose.access_token}`,
                        },
                    }
                );

                //console.log(res.data);
                //Aqui va para sacar los datos que regresa google
                //si existe res.data entonces mandar a la API a verificar 
                if (res.data) {
                    console.log(res.data);
                    const { email: email, family_name: apellidos, given_name: nombres, hd: dominio, name: nombres_completos, picture: foto } = res.data;
                    //Llama al metodo pasandole el email
                    GoogleLogin(email, nombres_completos, dominio, foto);
                    const cookies = new Cookies();
                    cookies.set("Nombres", nombres_completos, { path: "/" });
                }
            } catch (error) {
                console.log(error);
            }
        },
    });
    const GoogleLogin = async (email, name, hd, foto) => {
        setLoader(true);
        try {
            setLoader(true);
            console.log(email);
            const result = await axios.post(
                process.env.NEXT_PUBLIC_ACCESLINK + "auth/loginParticipante",
                { email: email, name: name, hd: hd },
                {
                    withCredentials: true,
                }
            );
            //console.log("asdas", result);
            const cookies = new Cookies();
            //Cookie para el token
            cookies.set("myTokenName", result.data.token, { path: "/" }); //enviar cokiee y almacenarla
            //Cookie para el id del usuario
            cookies.set("id_user", result.data.id, { path: "/" });
            //agregar una nueva cookie para identificar el id del formulario 
            cookies.set("token_test", token, { path: "/" });
            cookies.set("foto_url", foto, { path: "/" });
            setLoader(false);
            //para abrir la nueva ruta en la misma pestana
            //antes de reenviar primero verificar si este usuario ya se encuentra registrado en el test 
            const response = await fetch(
                process.env.NEXT_PUBLIC_ACCESLINK +
                "test/VerificacionIngresoParticipante/" + result.data.id +
                "/" + token,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            const data = await response.json();
            //si no encuentra verificado en el test entonces que se registre
            if (data.r_verification)
                Router.push("/FormulariosOP/Test");
            else
                Router.push("/FormulariosOP/Hola");
            //console.log(result.data);
            setLoader(false);
        } catch (error) {
            console.log(error);
            setLoader(false);
            //colocar una alerta de error cuando no se pueda inciar sesion
            //setError(true);
            setMensajeError(error.response.data.error);
            //alert(error.response.data.error);
            setError(true);
        }
    };
    */

  //INgresar normal manualmente

  const [formData, setFormData] = useState({
    nombresApellidos: "",
    correoInstitucional: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginNormal = async () => {
    setLoader(true);
    try {
      const { nombresApellidos, correoInstitucional } = formData;

      // Verificar que los campos no estén vacíos
      if (!nombresApellidos.trim()) {
        // Si el campo nombresApellidos está vacío, muestra un mensaje de error
        throw new Error("El campo nombres y apellidos es requerido.");
      }

      if (!correoInstitucional.trim()) {
        // Si el campo correoInstitucional está vacío, muestra un mensaje de error
        throw new Error("El campo correo institucional es requerido.");
      }

      // Verificamos que el correoInstitucional tenga un formato válido antes de intentar extraer el dominio
      if (correoInstitucional.includes("@")) {
        var dominio = correoInstitucional.split("@")[1];
        //console.log("Dominio:", dominio);
        //console.log("nombresApellidos:", nombresApellidos);
      } else {
        console.log("El correo electrónico no tiene un formato válido.");
      }

      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "auth/loginParticipante",
        { email: correoInstitucional, name: nombresApellidos, hd: dominio },
        {
          withCredentials: true,
        }
      );
      //console.log("asdas", result);
      const cookies = new Cookies();
      //Cookie para el token
      cookies.set("myTokenName", result.data.token, { path: "/" }); //enviar cokiee y almacenarla
      //Cookie para el id del usuario
      cookies.set("id_user", result.data.id, { path: "/" });
      //agregar una nueva cookie para identificar el id del formulario
      cookies.set("token_test", token, { path: "/" });
      //cookies.set("foto_url", foto, { path: "/" });
      //para abrir la nueva ruta en la misma pestana
      //antes de reenviar primero verificar si este usuario ya se encuentra registrado en el test
      const response = await fetch(
        process.env.NEXT_PUBLIC_ACCESLINK +
          "test/VerificacionIngresoParticipante/" +
          result.data.id +
          "/" +
          token,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      //si no encuentra verificado en el test entonces que se registre
      //if (data.r_verification) Router.push("/FormulariosOP/Test");
      //else Router.push("/FormulariosOP/Hola");
      //console.log(result.data);
      // setLoader(false);
      console.log("Para Verificar");
      console.log(data);
      //si el test es abierto entonces verificar si ya esta registrado o para registrarse
      if (data.r_abierta) {
        if (data.r_registrado)
          //si esta registrado entonces eviarlo  a Hola
          RegistrarIngreso(result.data.id, token); // registrar tabla ingreso
        else Router.push("/FormulariosOP/Hola"); //registrarse
      }
      //si el test es cerrado verificar que este dentro de la lista
      else {
        if (data.r_registrado)
          if (data.r_accion === "Registrar")
            //si esta registrado entonces eviarlo  a Hola
            Router.push("/FormulariosOP/Hola"); // registrar tabla ingreso
          else RegistrarIngreso(result.data.id, token);
        //registrarse
        //            RegistrarIngreso(result.data.id, token); // registrar tabla ingreso
        else setNoAdmiitido(true);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      //setError(true);
      if (error.response && error.response.data && error.response.data.error) {
        // Si hay un error en la respuesta del servidor, mostrar el mensaje de error del servidor
        setMensajeError(error.response.data.error);
      } else {
        // Si no hay un error específico del servidor, mostrar el mensaje de error general
        setMensajeError(error.message);
      }
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const RegistrarIngreso = async (tokenid, token) => {
    setLoader(true);
    try {
      setLoader(true);
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "test/RegistrarIngreso",
        {
          user_id_token: tokenid,
          test_id_token: token,
          user_age: navigator.userAgent,
        },
        {
          withCredentials: true,
        }
      );
      //setLoader(false);
      Router.push("/FormulariosOP/Test"); // registrar tabla ingreso
    } catch (error) {
      console.log(error);
      alert("Error");
      setLoader(false);
      //colocar una alerta de error cuando no se pueda inciar sesion
      //setError(true);
      setMensajeError(error.response.data.error);
      //alert(error.response.data.error);
      setError(true);
    }
  };
  const [noAdmitido, setNoAdmiitido] = useState(false);

  const cerrar1 = (valor) => {
    setError(valor);
  };
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  //Hacer un Switch para habilitar el inicio de google, en el cual si un case falla retornar falso el inicio de sesion con google
  //primero verificar si el formulario esta activo y mostrar el login xd
  //para realizar la consulta sobre el estado del formulario se obtiene el token desde la URL
  return (
    <>
      <Head>
        <title>Registrar en el formulario</title>
      </Head>
      <Dialog open={noAdmitido} handler={() => setNoAdmiitido(!noAdmitido)}>
        <DialogHeader>Acceso no permitido</DialogHeader>
        <DialogBody>
          El Test es cerrado y la cuenta con la cual desea ingresar no se
          encuentra en la lista. Contactese con un administrador.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="green"
            onClick={() => setNoAdmiitido(false)}
          >
            <span>Aceptar</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <NavBarFormsLogin
        titulo={"Hola"}
        user_name={"user1"}
        viewLogin={EnableGoogle}
        loginG={loginNormal}
      />
      {load && <Loader />}
      {error ? (
        <Dialog_Error
          mensaje={mensajeError}
          titulo="Error al autenticar"
          cerrar={cerrar1}
        />
      ) : (
        ""
      )}
      {EstadoFormulario !== 0 ? (
        <>
          {/* ESTADOS
          -Erroneo     1
          -Caducado		 2
          -Proximo		 3	
          -Suspendido	 4	
          -No existe 	 5
          -Default 		 0
          */}
          {EstadoFormulario == 1 && (
            <div className="mx-auto items-center text-center font-body text-4xl mt-8">
              <Typography variant="h4" color="blue-gray">
                El formulario esta erroneo
              </Typography>
              <div className="mx-auto">
                <Lottie
                  animationData={anim_erroneo}
                  className="w-1/3 mx-auto"
                />
              </div>
            </div>
          )}
          {EstadoFormulario == 2 && (
            <div className="mx-auto items-center text-center font-body text-4xl mt-8">
              <Typography variant="h4" color="blue-gray">
                El formulario esta caducado
              </Typography>
              <div className="mx-auto">
                <Lottie animationData={anim_reloj} className="w-1/3 mx-auto" />
              </div>
            </div>
          )}
          {EstadoFormulario == 3 && (
            <div className="mx-auto items-center text-center font-body text-4xl mt-8">
              <Typography variant="h4" color="blue-gray">
                El formulario esta proximo a habilitarse:{" "}
                {DataForm.r_fecha_hora_inico}
              </Typography>
              <div className="mx-auto">
                <Lottie animationData={anim_reloj} className="w-1/3 mx-auto" />
              </div>
            </div>
          )}
          {EstadoFormulario == 4 && (
            <div className="mx-auto items-center text-center font-body text-4xl mt-8">
              <Typography variant="h4" color="blue-gray">
                El formulario esta suspendido
              </Typography>
              <div className="mx-auto">
                <Lottie
                  animationData={anim_erroneo}
                  className="w-1/3 mx-auto"
                />
              </div>
            </div>
          )}
          {EstadoFormulario == 5 && (
            <div className="mx-auto items-center text-center font-body text-4xl mt-8">
              <Typography variant="h4" color="blue-gray">
                El formulario no existe
              </Typography>
              <div className="mx-auto">
                <Lottie
                  animationData={anim_not_exist}
                  className="w-1/3 mx-auto"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {EstadoFormulario === 0 && (
            <>
              <Card
                color="transparent"
                shadow={false}
                className="mx-auto w-full max-w-[27rem] mt-3 shadow-xl p-6   text-center bg-white items-center justify-center mb-6  rounded-none shadow-blue-gray-300"
              >
                <Typography variant="h4" color="blue-gray">
                  Registrar en el Formulario: {DataForm.r_titulo}
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Para continuar al Formulario complete lo siguiente
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                  <div className="mb-1 flex flex-col gap-6">
                    <Input
                      name="nombresApellidos"
                      value={formData.nombresApellidos}
                      onChange={handleChange}
                      size="lg"
                      placeholder="Nombres y apellidos"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                    <Input
                      size="lg"
                      type="email"
                      name="correoInstitucional"
                      value={formData.correoInstitucional}
                      onChange={handleChange}
                      placeholder="Correo institucional"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900 rounded-none"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>
                  <Button
                    className="mt-6 rounded-none bg-light-green-900 hover:bg-orange-600 "
                    fullWidth
                    onClick={loginNormal}
                  >
                    Aceptar
                  </Button>
                </form>
              </Card>
            </>
          )}
        </>
      )}
    </>
  );
}
