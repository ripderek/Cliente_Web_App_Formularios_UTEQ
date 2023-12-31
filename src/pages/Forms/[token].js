import React from 'react'
import { useRouter } from 'next/router';
//importar la barra de navegacion 
import { NavBarForms } from '@/components/FormsLayout'

export default function Formulario() {
    const router = useRouter();
    const { token } = router.query;

    //primero verificar si el formulario esta activo y mostrar el login xd
    //para realizar la consulta sobre el estado del formulario se obtiene el token desde la URL
    return (
        <div>
            <div>
                <NavBarForms user_name={"Hola"} titulo={"Inicio"} />
            </div>
            token: {token}
        </div>
    )
}
