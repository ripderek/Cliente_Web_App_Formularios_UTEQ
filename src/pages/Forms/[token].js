import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Router from "next/router";
import Cookies from "universal-cookie";

//importar la barra de navegacion 
import { NavBarFormsLogin } from '@/components/FormsLayout'
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
} from "@material-tailwind/react";
import alertGradient from '@material-tailwind/react/theme/components/alert/alertGradient';
import { Dialog_Error, Loader, Notification } from "@/widgets"; //Importar el componente

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
            Datos_Formulario(token);
        }
    }, [token]);


    const Datos_Formulario = async (token3) => {
        setLoader(true);
        const cookies = new Cookies();
        cookies.remove("id_user");
        cookies.remove("myTokenName");
        cookies.remove("token_test");
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_ACCESLINK +
                "auth/DatosFormulario/" +
                token3,
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
            if (data) {
                setNotFound(false);
                //como si hay data crear un switch para verificar si se puede iniciar sesion 
                //con el switch si una varibale esta en falso deshbilita la funcion de iniicar sesion
                setEnableGoogle(true);
            }
            setLoader(false);
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

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
            <NavBarFormsLogin titulo={"Hola"} user_name={"user1"} viewLogin={EnableGoogle} loginG={loginG} />
            {load ? <Loader /> : ""}
            {error ? (
                <Dialog_Error
                    mensaje={mensajeError}
                    titulo="Error al autenticar"
                    cerrar={cerrar1}
                />
            ) : (
                ""
            )}
            {NotFound ? (<div className='mx-auto items-center text-center font-body text-4xl mt-8'>{":(  "}Este formulario no existe </div>) : <Card className="w-96 mx-auto mt-6 border-4 border-solid border-green-900 rounded-none">
                <CardHeader floated={false} className="h-auto 	">
                    {/* 
                    <img src="https://docs.material-tailwind.com/img/team-3.jpg" alt="profile-picture" />
                    */}
                </CardHeader>
                <CardBody className="text-center">
                    <Typography variant="h4" color="blue-gray" className="mb-2">
                        {DataForm.r_titulo}
                    </Typography>
                    <Typography color="blue-gray" className="font-medium" textGradient>
                        {DataForm.r_descripcion}
                    </Typography>
                </CardBody>
                <CardFooter className="flex justify-center gap-7 pt-2">
                    <Tooltip content="Like">
                        <Typography
                            as="a"
                            href="#facebook"
                            variant="lead"
                            color="blue"
                            textGradient
                        >
                            <i className="fab fa-facebook" />
                        </Typography>
                    </Tooltip>
                    <Tooltip content="Follow">
                        <Typography
                            as="a"
                            href="#twitter"
                            variant="lead"
                            color="light-blue"
                            textGradient
                        >
                            <i className="fab fa-twitter" />
                        </Typography>
                    </Tooltip>
                    <Tooltip content="Follow">
                        <Typography
                            as="a"
                            href="#instagram"
                            variant="lead"
                            color="purple"
                            textGradient
                        >
                            <i className="fab fa-instagram" />
                        </Typography>
                    </Tooltip>
                </CardFooter>
            </Card>}


        </>

    )
}
