import React from 'react'
import { useRouter } from 'next/router';

//importar la barra de navegacion 
import { NavBarForms } from '@/components/FormsLayout'
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";


export default function Formulario() {
    const router = useRouter();
    const { token } = router.query;

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

                const { email : email, family_name: apellidos, given_name: nombres, hd: dominio, name: nombres_completos, picture: foto } = res.data;

                console.log("Email:", email);
                console.log("Apellidos:", apellidos);
                console.log("Nombres:", nombres);
                console.log("Dominio:", dominio);
                console.log("Nombres Completos:", nombres_completos);
                console.log("Foto:", foto);

                //Llama al metodo pasandole el email
            } catch (error) {
                console.log(error);
            }
        },
    });

    //primero verificar si el formulario esta activo y mostrar el login xd
    //para realizar la consulta sobre el estado del formulario se obtiene el token desde la URL
    return (        
        <>
            <div>token: {token}</div>
            <div
                        className="h-auto bg-green-200  flex items-center justify-center mt-4 cursor-pointer text-center rounded-lg mx-auto"
                        onClick={loginG}
                    >
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
        </>

    )
}
