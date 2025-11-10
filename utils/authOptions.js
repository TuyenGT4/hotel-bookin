import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import User from "@/model/user";

import bcrypt from "bcrypt";

import dbConnect from "@/utils/dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        await dbConnect();

        const { email, phone, password } = credentials;

        if (!email && !phone) {
          throw new Error("Email or phone number is required");
        }

        const user = await User.findOne({
          $or: [{ email: email || "" }, { phone: phone || "" }],
        });

        if (!user?.password) {
          throw new Error("Please login via the method used to sign up");
        }

        const isPasswordValid =
          user && (await bcrypt.compare(password, user.password));

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      const { email, phone } = user;

      let dbUser = await User.findOne({
        $or: [{ email: email || "" }, { phone: phone || "" }],
      });

      if (!dbUser && account?.provider === "google") {
        dbUser = await User.create({
          email,
          name: user?.name,
          image: user?.image,
        });
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/`;
    },

    jwt: async ({ token, user }) => {
      const dbUser = await User.findOne({
        $or: [{ email: token.email || "" }, { phone: token.phone || "" }],
      });

      if (dbUser) {
        dbUser.password = undefined;

        token.user = {
          ...dbUser.toObject(),
          role: dbUser.role || "user",
        };
      }

      return token;
    },

    session: async ({ session, token }) => {
      session.user = {
        ...token.user,
        role: token.user.role || "user",
      };

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};
