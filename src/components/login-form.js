'use client'
import { useState } from 'react';
import { useSearchParams } from "next/navigation";
import Button from '@/components/button';
import Social from '@/components/social';
import { login } from '@/lib/actions'



export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    // const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    //   ? "Email already in use with different provider!"
    //   : "";

    const [resultado, setResultado] = useState("")
    const [tipo, setTipo] = useState("")

    async function wrapper(data) {
        const message = await login(data, callbackUrl) // Server action
        if (message.success) {
            setTipo('success')
            setResultado(message.success);
        } else {
            setTipo('error')
            setResultado(message.error);
        }

    }
    return (
        <>
            <h1>Iniciar sesión</h1>
            <form action={wrapper}>
                <label>Email
                    <input type='email' name='email'
                        placeholder="john.doe@example.com"
                    />
                </label>
                <label>Password
                    <input type="password" name='password'
                        placeholder="******"
                    />
                </label>

                <p className={`info ${tipo}`}> {resultado} </p>
                <Button title="Iniciar sesión con email y contraseña" />
            </form>
            <Social />

        </>

    );
};