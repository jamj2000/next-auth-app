'use server'
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth"
import { getUserByEmail } from "@/lib/user"
import bcrypt from 'bcryptjs'


const DEFAULT_LOGIN_REDIRECT = '/dashboard'

export async function register (formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
 
    // Comprobamos si el usuario ya está registrado
    const user = await getUserByEmail(email)

    if (user) {
        console.log('error');
        return { error: 'El email ya está registrado' }
    }

    // Encriptamos password 
    const hashedPassword = await bcrypt.hash(password, 10)

    // Guardamos credenciales en base datos
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    return { success: "Registro correcto" }
}




export async function login (formData, callbackUrl) {
    const email = formData.get('email')
    const password = formData.get('password')
 
  
    const existingUser = await getUserByEmail(email);
  
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "Email does not exist!" }
    }
  
    // if (!existingUser.emailVerified) {
    //   const verificationToken = await generateVerificationToken(
    //     existingUser.email,
    //   );
  
    //   await sendVerificationEmail(
    //     verificationToken.email,
    //     verificationToken.token,
    //   );
  
    //   return { success: "Confirmation email sent!" };
    // }
  
    // if (existingUser.isTwoFactorEnabled && existingUser.email) {
    //   if (code) {
    //     const twoFactorToken = await getTwoFactorTokenByEmail(
    //       existingUser.email
    //     );
  
    //     if (!twoFactorToken) {
    //       return { error: "Invalid code!" };
    //     }
  
    //     if (twoFactorToken.token !== code) {
    //       return { error: "Invalid code!" };
    //     }
  
    //     const hasExpired = new Date(twoFactorToken.expires) < new Date();
  
    //     if (hasExpired) {
    //       return { error: "Code expired!" };
    //     }
  
    //     await db.twoFactorToken.delete({
    //       where: { id: twoFactorToken.id }
    //     });
  
    //     const existingConfirmation = await getTwoFactorConfirmationByUserId(
    //       existingUser.id
    //     );
  
    //     if (existingConfirmation) {
    //       await db.twoFactorConfirmation.delete({
    //         where: { id: existingConfirmation.id }
    //       });
    //     }
  
    //     await db.twoFactorConfirmation.create({
    //       data: {
    //         userId: existingUser.id,
    //       }
    //     });
    //   } else {
    //     const twoFactorToken = await generateTwoFactorToken(existingUser.email)
    //     await sendTwoFactorTokenEmail(
    //       twoFactorToken.email,
    //       twoFactorToken.token,
    //     );
  
    //     return { twoFactor: true };
    //   }
    // }
  
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      })
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Credenciales no válidas !" }
          default:
            return { error: "Algo falló!" }
        }
      }
  
      throw error;
    }
}

export async function logout () {
    await signOut();
}
