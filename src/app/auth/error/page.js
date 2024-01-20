
// https://next-auth.js.org/configuration/pages#error-page

const errors = new Map();
errors.set('Configuration', "Hay un problema con la configuración del servidor.");
errors.set('AccessDenied', "No se pudo terminar de iniciar la sessión.");
errors.set('Verification', "El token ha caducado o ya ha sido utilizado.");
errors.set('Default', "Error inesperado.");

function page({ searchParams }) {

    return (
        <section className="auth">
            <h1>Error</h1>
            {errors.get(searchParams.error) ?? 'Error no determinado.'}
        </section>
    )
}

export default page