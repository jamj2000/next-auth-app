import { LoginForm } from '@/components/login-form'

// https://next-auth.js.org/configuration/pages#sign-in-page
const errors = new Map();
errors.set('OAuthSignin', "Intenta iniciar sesión con una cuenta diferente.");
errors.set('OAuthCallback', "Intenta iniciar sesión con una cuenta diferente.");
errors.set('OAuthCreateAccount', "Intenta iniciar sesión con una cuenta diferente.");
errors.set('EmailCreateAccount', "Intenta iniciar sesión con una cuenta diferente.");
errors.set('Callback', "Intenta iniciar sesión con una cuenta diferente.");
errors.set('OAuthAccountNotLinked', "Este email ya está registrado con otro proveedor.");
errors.set('EmailSignin', "Comprueba tu dirección de correo electrónico.");
errors.set('CredentialsSignin', "Fallo al iniciar sesion. Verifique que los datos que proporcionó sean correctos.");
errors.set('SessionRequired', "Error al iniciar sesión. Verifique que los detalles que proporcionó sean correctos.");
errors.set('Default', "No se puede iniciar sesión.");




function page({searchParams}) {


  return (
    <section className="auth">
      <LoginForm />
      {errors.get(searchParams.error)}
    </section>
  )
}

export default page