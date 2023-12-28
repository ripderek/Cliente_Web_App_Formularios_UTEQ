import React from 'react'
import { useRouter } from 'next/router';

export default function Formulario() {
    const router = useRouter();
    const { token } = router.query;

    //primero verificar si el formulario esta activo y mostrar el login xd

    return (
        <div>token: {token}</div>
    )
}
