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

export default function Formulario() {
  const router = useRouter();
  const { token } = router.query;
  const [load, setLoader] = useState(false);
  const cookies = new Cookies();
  //Mediante un usee effect obtener los datos del formulario enviando el token por URL de la API
  useEffect(() => {
    cookies.remove("id_user");
    cookies.remove("myTokenName");
    cookies.remove("token_test");
    if (token) {
      Consulta_Estado_Token(token);
    }
  }, [token]);
  //para verificar el estado del formulario segun el token que se ingrese
  const Consulta_Estado_Token = async (token3) => {
    setError("");
    setLoader(true);
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_ACCESLINK + "auth/verificar_cuenta/" + token3,
        {},
        {
          withCredentials: true,
        }
      );
      //SetEstadoFormulario(data.r_estado);
      alert("Puede iniciar sesion en la paguina principal");
      Router.push("/FormulariosOP/Hola");
    } catch (error) {
      setError(error.response.data.message);
      //alert("Error");
      setLoader(false);
      console.log(error);
    }
  };
  const [error, setError] = useState("");
  return (
    <>
      <Head>
        <title>Verificar Cuenta</title>
      </Head>
      <NavBarFormsLogin
        titulo={"Hola"}
        user_name={"user1"}
        viewLogin={false}
        loginG={false}
      />
      {load && <Loader />}
      <Typography variant="h2" className="mt-6 mx-auto text-center">
        {error}
      </Typography>
    </>
  );
}
