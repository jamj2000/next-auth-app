"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";


export default function Social() {
    const DEFAULT_LOGIN_REDIRECT = '/dashboard'
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const options = { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT }

    return (
        <div className="social">
            <button onClick={() => signIn("google", options)} >
                <img src="/google.svg" alt="google" /> Iniciar sesión con Google
            </button>
            <button onClick={() => signIn("github", options)} >
                <img src="/github.svg" alt="Github" /> Iniciar sesión con Github
            </button>
        </div>
    );
};