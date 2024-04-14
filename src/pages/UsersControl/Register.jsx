import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { Dialog_Error, Loader } from "@/widgets";

import axios from "axios";
export default function Register({
  CerrarFormRegister,
  FormRegister,
  openALertRegister,
}) {
  //variable para mostrar el loader cuando carga una peticion
  const [load, setLoader] = useState(false);
  //variable para detectar un error y mostrar el error
  const [error, setError] = useState(false);
  //variable para almacenar el mensaje del error
  const [mensajeError, setMensajeError] = useState("");
  const [daContra, set2Dacontra] = useState("");
  const [userData, setUserData] = useState({
    p_contrasena: "",
    p_correo_institucional: "",
    p_identificacion: "",
    p_nombres_apellidos: "",
    p_celular: "",
  });
  // Función para manejar el cambio en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  //funcion para crear el usuario skere modo diablo
  const CrearUsuario = async (e) => {
    e.preventDefault();
    //process.env.NEXT_PUBLIC_ACCESLINK
    //Router.push("/Inicio");
    setLoader(true);
    //verificar que las dos contraseñas conincidan
    if (daContra !== userData.p_contrasena) {
      setError(true);
      setMensajeError("Las contraseñas no coinciden");
    } else {
      try {
        const result = await axios.post(
          process.env.NEXT_PUBLIC_ACCESLINK + "auth/Crear_Usuario",
          userData,
          {
            withCredentials: true,
          }
        );
        setLoader(false);
        openALertRegister();
        CerrarFormRegister();
        setUserData({
          p_contrasena: "",
          p_correo_institucional: "",
          p_identificacion: "",
          p_nombres_apellidos: "",
          p_celular: "",
        });
      } catch (error) {
        console.log(error);

        setLoader(false);
        //colocar una alerta de error cuando no se pueda inciar sesion
        setError(true);
        setMensajeError(error.response.data.error);
      }
    }
  };
  const cerrar = () => {
    setError(false);
  };
  return (
    <>
      <Dialog
        open={FormRegister}
        handler={CerrarFormRegister}
        className="bg-transparent shadow-none"
        size="xs"
      >
        {error && (
          <Dialog_Error
            mensaje={mensajeError}
            titulo="Error Inicio de sesion"
            cerrar={cerrar}
          />
        )}
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Crear cuenta
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Llene el formulario
            </Typography>

            <Input
              label="Tus nombres"
              size="lg"
              name="p_nombres_apellidos"
              onChange={handleInputChange}
              value={userData.p_nombres_apellidos}
            />
            <Input
              label="Numero de identificacion"
              size="lg"
              maxLength={10}
              type="number"
              name="p_identificacion"
              onChange={handleInputChange}
              value={userData.p_identificacion}
            />
            <Input
              label="Tu numero de telefono"
              size="lg"
              maxLength={10}
              type="number"
              name="p_celular"
              onChange={handleInputChange}
              value={userData.p_celular}
            />
            <Input
              label="Correo Institucional"
              size="lg"
              type="email"
              name="p_correo_institucional"
              onChange={handleInputChange}
              value={userData.p_correo_institucional}
            />
            <Input
              label="Contraseña"
              size="lg"
              type="password"
              name="p_contrasena"
              onChange={handleInputChange}
              value={userData.p_contrasena}
            />
            <Input
              label="Repite la Contraseña"
              size="lg"
              type="password"
              value={daContra}
              onChange={(e) => set2Dacontra(e.target.value)}
            />
            {/*   <Typography className="-mb-2" variant="h6">
              Your Password
            </Typography>*/}
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={CrearUsuario} fullWidth className="bg-green-800">
              Aceptar
            </Button>
            {/*  <Typography variant="small" className="mt-4 flex justify-center">
              Don&apos;t have an account?
              <Typography
                as="a"
                href="#signup"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold"
                onClick={CerrarFormRegister}
              >
                Sign up
              </Typography>
            </Typography>*/}
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
