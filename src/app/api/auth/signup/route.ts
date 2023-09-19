import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

export async function GET() {
  return NextResponse.json({
    id: "ansdfshu",
  });
}

interface formData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phoneNumber: number;
  password: string;
}

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const res: formData = await request.json();
  const errors: string[] = [];

  const validationSchema = [
    {
      valid: validator.isLength(res.firstName, {
        min: 1,
      }),
      errorMessage: "First Name is invalid",
    },
    {
      valid: validator.isLength(res.lastName, {
        min: 1,
      }),
      errorMessage: "Last Name is invalid",
    },
    {
      valid: validator.isLength(res.city, {
        min: 1,
      }),
      errorMessage: "City is invalid",
    },
    {
      valid: validator.isEmail(res.email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isMobilePhone(String(res.phoneNumber)),
      errorMessage: "Phone number is invalid",
    },
    {
      valid: validator.isLength(res.password, {
        min: 5,
      }),
      errorMessage: "password is invalid",
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

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email: res.email,
    },
  });

  if (userWithEmail) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: "email address already associated with another account",
      }),
      {
        status: 400,
      }
    );
  }

  const hashedPassword = await bcrypt.hash(res.password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: res.firstName,
      last_name: res.lastName,
      email: res.email,
      city: res.city,
      phone: String(res.phoneNumber),
      password: hashedPassword,
    },
  });

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

// password12334434
