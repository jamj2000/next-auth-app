'use client'
import Button from '@/components/button';
import { signIn } from "next-auth/react";
import { useState } from 'react';
import { useSearchParams } from "next/navigation";
import { register } from '@/lib/actions'
import Social from '@/components/social';

export function RegisterForm() {
    const [resultado, setResultado] = useState("")
    const [tipo, setTipo] = useState("")

    async function wrapper(data) {
        const message = await register(data) // Server action
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
            <h1>Crear una cuenta</h1>
            <form action={wrapper}>
                <label>Nombre
                    <input type='text' name='name'
                        placeholder="John Doe"
                    />
                </label>
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
                <Button title="Crear cuenta" />
            </form>
            <hr />
            <Social />
        </>

    );
};