import { NextRequest, NextResponse } from "next/server";
import { times } from "@/data";
import { PrismaClient } from "@prisma/client";
import { findAvailiableTables } from "@/utils/findAvailabeTables";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const partySize = req.nextUrl.searchParams.get("partySize") as string;
  const bookingTime = req.nextUrl.searchParams.get("time") as string;
  const bookingDate = req.nextUrl.searchParams.get("date") as string;
  if (!partySize || !bookingTime || !bookingDate) {
    return NextResponse.json(
      {
        errorMessage: "invalid data provided",
      },
      {
        status: 400,
      }
    );
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if(!restaurant){
    return NextResponse.json(
      {
        errorMessage: "no restaurant found",
      },
      {
        status: 400,
      }
    );
  }

  const searchedTimesWithTables = await findAvailiableTables({
    slug,
    bookingDate,
    bookingTime,
    restaurant
  })

  if(!searchedTimesWithTables){
    return NextResponse.json(
      {
        errorMessage: "no time found",
      },
      {
        status: 400,
      }
    );
  }

  const availabilities = searchedTimesWithTables
    .map((t) => {
      const totalSeats = t.tables?.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);

      return {
        time: t.time,
        avaliable: (totalSeats as number) >= parseInt(partySize),
      };
    })
    .filter((avalability) => {
      const timeIsAfterOpeningHours =
        new Date(`${bookingDate}T${avalability.time}`) >=
        new Date(`${bookingDate}T${restaurant?.open_time}`);
      const timeIsBeforeClosingHours =
        new Date(`${bookingDate}T${avalability.time}`) <=
        new Date(`${bookingDate}T${restaurant?.close_time}`);

      return timeIsAfterOpeningHours && timeIsBeforeClosingHours;
    });

  return NextResponse.json(availabilities,
    {
      status: 200,
    }
  );
}
