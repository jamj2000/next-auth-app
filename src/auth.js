import NextAuth from "next-auth"
import Credentials from "@auth/core/providers/credentials"
import Google from "@auth/core/providers/google"
import Github from '@auth/core/providers/github'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"
import { getUserByEmail, getUserById, getAccountByUserId } from "@/lib/user"





export const proveedores = {
    providers: [
        Google,
        Github,
        Credentials({
            async authorize(credentials) {
                // const validatedFields = LoginSchema.safeParse(credentials);

                // if (validatedFields.success) {
                //     const { email, password } = validatedFields.data;

                //     const user = await getUserByEmail(email);
                //     if (!user || !user.password) return null;

                //     const passwordsMatch = await bcrypt.compare(
                //         password,
                //         user.password,
                //     );

                //     if (passwordsMatch) return user;
                // }

                // return null;

                const user = await getUserByEmail(credentials.email);
                if (!user || !user.password) return null;

                if (user) {  // && user.emailVerified
                    const passwordsMatch = await bcrypt.compare(credentials.password, user.password)
                    if (passwordsMatch) return user
                    // if (passwordsMatch) return true
                } else {
                    return null
                }

            }
        })
    ],

}



export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth without email verification
            if (account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id);

            // Prevent sign in without email verification
            //   if (!existingUser?.emailVerified) return false;

            //   if (existingUser.isTwoFactorEnabled) {
            //     const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            //     if (!twoFactorConfirmation) return false;

            //     // Delete two factor confirmation for next sign in
            //     await prisma.twoFactorConfirmation.delete({
            //       where: { id: twoFactorConfirmation.id }
            //     });
            //   }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role;
            }

            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
            }

            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isOAuth = token.isOAuth;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(
                existingUser.id
            );

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

            return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...proveedores
})




// ----> https://blog.stackademic.com/next-js-13-authentication-with-nextauth-js-app-router-typescript-641058805bc3




