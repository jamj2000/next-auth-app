'use client'
import { useFormStatus } from 'react-dom'

function Button({title}) {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending}  >
            {title}
        </button>
    )
}

export default Button