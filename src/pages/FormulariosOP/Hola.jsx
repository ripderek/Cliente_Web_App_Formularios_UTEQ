import React from "react";
import { FormDatos } from "@/pages/FormulariosOP";
import { NavBarFormsLogin, NavBarForms } from "@/components/FormsLayout";

//este va a ser el formulario maestro desde aqui se va a enviar toda la info de los demas formularios hijos

export default function Hola() {
  //primero extraer las cookies del usuario
  //y el token del cuestionario para extraer los datos y hacer una consulta para llenar el formulario de los datos

  return (
    <div className="">
      <NavBarForms />
      <FormDatos />
    </div>
  );
}
