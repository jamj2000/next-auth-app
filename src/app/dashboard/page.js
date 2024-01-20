import { auth } from '@/auth'
import { logout } from '@/lib/actions'

async function page() {
    const sesion = await auth()
    console.log(sesion);

    if (sesion)
        return (
            <div>
                <h1>Dashboard</h1>
                {sesion?.user?.image && <img src={sesion?.user?.image} alt="avatar" />}
                <p>{sesion?.user?.name}</p>
                <p>{sesion?.user?.email}</p>
                <p>{sesion?.user?.role}</p>
                <form>
                <button formAction={logout}>Log out</button>
                </form>
            </div>
        )

}

export default page