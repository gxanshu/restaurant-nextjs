import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

interface FormData {
  email: string;
  password: string;
}

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({
    id: "ansdfshu",
  });
}

export async function POST(request: Request) {
  const res: FormData = await request.json();
  const errors: string[] = [];

  const validationSchema = [
    {
      valid: validator.isEmail(res.email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isLength(res.password, {
        min: 5,
      }),
      errorMessage: "Password is invalid",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessage);
    }
  });

  if (errors.length) {
    return new NextResponse(JSON.stringify({ errorMessage: errors[0] }), {
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: res.email,
    },
  });

  if (!user) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "no account find" }),
      {
        status: 400,
      }
    );
  }

  const isMatch = await bcrypt.compare(res.password, user.password);

  if (!isMatch) {
    return new NextResponse(
      JSON.stringify({ errorMessage: "Password is incorrect" }),
      {
        status: 400,
      }
    );
  }

  const alg = "HS256";
  const signature = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT({ email: res.email })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(signature);

  const response = NextResponse.json(
    {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      city: user.city,
      phoneNumber: user.phone,
      email: user.email,
    },
    { status: 200 }
  );
  response.cookies.set({
    name: "jwt",
    value: token,
    maxAge: 60 * 60 * 24
  });

  return response;
}
