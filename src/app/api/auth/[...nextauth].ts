import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing username or password');
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username
          }
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Compare password
        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user object that matches NextAuth User type
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,  // Fix: explicitly type the strategy
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };