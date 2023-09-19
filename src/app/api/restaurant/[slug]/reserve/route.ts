import { findAvailiableTables } from "@/utils/findAvailabeTables";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface bookingData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  occasion: string;
  request: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const partySize = req.nextUrl.searchParams.get("partySize") as string;
  const bookingTime = req.nextUrl.searchParams.get("time") as string;
  const bookingDate = req.nextUrl.searchParams.get("date") as string;

  const {
    email,
    firstName,
    lastName,
    occasion,
    phoneNumber,
    request
  }: bookingData = await req.json();

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
      id: true
    },
  });

  if (!restaurant) {
    return NextResponse.json(
      {
        errorMessage: "no restaurant find with that slug",
      },
      { status: 400 }
    );
  }

  if (
    new Date(`${bookingDate}T${bookingTime}`) <
      new Date(`${bookingDate}T${restaurant.open_time}`) ||
    new Date(`${bookingDate}T${bookingTime}`) >
      new Date(`${bookingDate}T${restaurant.close_time}`)
  ) {
    return NextResponse.json(
      {
        errorMessage: "date time not avilable",
      },
      { status: 400 }
    );
  }

  const searchedTimesWithTables = await findAvailiableTables({
    slug,
    bookingDate,
    bookingTime,
    restaurant,
  });

  const avilableTables = searchedTimesWithTables?.find((t) => {
    return (
      t.date.toISOString() ===
      new Date(`${bookingDate}T${bookingTime}`).toISOString()
    );
  });

  if (!avilableTables) {
    return NextResponse.json(
      {
        errorMessage: "no table available",
      },
      { status: 400 }
    );
  }

  const tableCount: {
    2: number[];
    4: number[];
  } = {
    2: [],
    4: [],
  };

  avilableTables.tables.forEach((table) => {
    if (table.seats === 2) {
      tableCount[2].push(table.id);
    } else {
      tableCount[4].push(table.id);
    }
  });

  const tablesToBook: number[] = [];
  let seatRemaining = parseInt(partySize); // 6 // 2

  while (seatRemaining > 0) {
    if (seatRemaining >= 3) {
      if (tableCount[4].length) {
        tablesToBook.push(tableCount[4][0]);
        tableCount[4].shift();
        seatRemaining = seatRemaining - 4;
      } else {
        tablesToBook.push(tableCount[2][0]);
        tableCount[2].shift();
        seatRemaining = seatRemaining - 2;
      }
    } else {
      if (tableCount[2].length) {
        tablesToBook.push(tableCount[2][0]);
        tableCount[2].shift();
        seatRemaining = seatRemaining - 2;
      } else {
        tablesToBook.push(tableCount[4][0]);
        tableCount[4].shift();
        seatRemaining = seatRemaining - 4;
      }
    }
  }

  const booking = await prisma.booking.create({
    data: {
      number_of_people: parseInt(partySize),
      booker_email: email,
      booker_first_name: firstName,
      booker_last_name: lastName,
      booker_occasion: occasion,
      booker_request: request,
      booker_phone: phoneNumber,
      booking_time: new Date(`${bookingDate}T${bookingTime}`),
      restaurant_id: restaurant.id
    }
  })

  const bookingsOnTableData = tablesToBook.map(table_id => {
    return {
      table_id,
      booking_id: booking.id
    }
  })

  await prisma.bookingOnTable.createMany({
    data: bookingsOnTableData
  })

  return NextResponse.json(booking);
}
