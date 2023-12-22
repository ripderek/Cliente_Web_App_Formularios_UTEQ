import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import Router from "next/router";
import axios from "axios";
import { Dialog_Error, Loader } from "@/widgets";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import anim from "../../public/anim/check.json";
//paguina para el login desde los administradores --> profesores
export default function Index() {
    //Borrar cookies en caso de existir alguna
    useEffect(() => {
        const cookies = new Cookies();
        cookies.remove("id_user");
        cookies.remove("myTokenName");
    }, []);
    //variables para el inicio de sesion
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    //variable para detectar un error y mostrar el error 
    const [error, setError] = useState(false);
    //variable para almacenar el mensaje del error
    const [mensajeError, setMensajeError] = useState('');
    //variable para mostrar el loader cuando carga una peticion 
    const [load, setLoader] = useState(false);
    //variable para saber si se inicio sesion correctamente 
    const [autenticado, setAutencidado] = useState(false);
    //funcion para alimentar la variable que contiene las credenciales 
    const HandleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    //funcion para logear y redirigir al menu principal
    const IncioSesion = async (e) => {
        e.preventDefault();
        //process.env.NEXT_PUBLIC_ACCESLINK
        //Router.push("/Inicio");
        setLoader(true);
        try {
            const result = await axios.post(
                process.env.NEXT_PUBLIC_ACCESLINK + "auth/Login",
                user,
                {
                    withCredentials: true,
                }
            );
            const cookies = new Cookies();
            //Cookie para el token
            cookies.set("myTokenName", result.data.token, { path: "/" }); //enviar cokiee y almacenarla
            //Cookie para el id del usuario
            cookies.set("id_user", result.data.id, { path: "/" });
            setLoader(false);
            //para abrir la nueva ruta en la misma pestana
            //Router.push("/dashboard/Home");

            //para abrir la nueva ventana del dashboard 
            // Para abrir una nueva ruta en la misma pestaña
            const nuevaRuta = "/dashboard/Home"; // Reemplaza con tu nueva ruta

            const nuevaPestana = window.open(nuevaRuta, "_blank");

            // Asegúrate de manejar el caso en el que window.open sea bloqueado por el navegador
            if (nuevaPestana) {
                //hacer la interfaz cambie y que salga un mensaje de accedido con exito xd
                setAutencidado(true);
            } else {
                // window.open fue bloqueado por el navegador
                // Puedes proporcionar un mensaje al usuario o tomar otras medidas
                alert('La apertura de la nueva pestaña fue bloqueada por el navegador.');
            }

            //console.log(result.data);

        } catch (error) {
            setLoader(false);
            //colocar una alerta de error cuando no se pueda inciar sesion
            setError(true);
            setMensajeError(error.response.data.error);
        }
    }
    //funcion para cerrar el dialog del error 
    const cerrar = (valor) => {
        setError(valor)
    }
    return (
        <div className=" w-full h-full ">
            {load ? <Loader /> : ""}
            {error ? <Dialog_Error mensaje={mensajeError} titulo="Error Inicio de sesion" cerrar={cerrar} /> : ("")}
            <Card color="transparent" shadow={false} className="mx-auto w-full max-w-[24rem] mt-10 shadow-xl p-6 border-blue-gray-50 border border-solid text-center bg-white items-center justify-center p-4">
                <div className="p-2 mx-auto">
                    <img
                        className="h-10"
                        src="/img/Home/Extintor_logo.png"
                        alt="Extintor"
                    />
                </div>
                <Typography variant="h4" color="blue-gray">
                    Iniciar Sesion
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Ir a la aplicación de formularios
                </Typography>
                {autenticado ? (<div className="mx-auto">

                    <Lottie animationData={anim} className="w-32 mx-auto" />
                    <Typography color="gray" className="mt-1 font-normal">
                        Autenticado con exito, puede continuar a la Aplicación
                    </Typography>
                </div>) : (<form className="mt-8 mb-2" onSubmit={IncioSesion}>
                    <div className="mb-1 flex flex-col gap-6">
                        <Input
                            variant="outlined"
                            label="Correo Institucional"
                            size="lg"
                            name="email"
                            onChange={HandleChange}
                        />
                        <Input
                            onChange={HandleChange}
                            type="password"
                            name="password"
                            label="Contraseña"
                            size="lg"
                            placeholder="********"
                        />
                    </div>

                    <Button className="mt-6 bg-light-green-900 font-bold " type="submit" fullWidth >
                        Aceptar
                    </Button>
                    <div className="h-auto bg-gray-200  flex items-center justify-center mt-4 cursor-pointer text-center rounded-lg mx-auto">
                        <div className="p-2">
                            <img
                                className="h-7 w-7 rounded-full"
                                src="/img/Home/Google.png"
                                alt="User image"
                            />
                        </div>
                        <div className="ml-2 font-bold text-blue-gray-600">
                            Continuar con Google
                        </div>
                    </div>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        ¿No recuerda su contraseña?{" "}
                        <a href="#" className="font-medium text-gray-900">
                            Recuperar acceso
                        </a>
                    </Typography>
                </form>)}
            </Card>
        </div>
    );
}

