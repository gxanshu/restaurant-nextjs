import { times } from "@/data";
import { PrismaClient, Table } from "@prisma/client";

const prisma = new PrismaClient()

export const findAvailiableTables = async({
  bookingTime,
  bookingDate,
  restaurant
}: {
  bookingTime: string;
  bookingDate: string;
  slug: string;
  restaurant: {
    open_time: string;
    close_time: string;
    tables: Table[];
}
}) => {
  const searchedTimes = times.find((t) => {
    return t.time === bookingTime;
  })?.searchTimes;

  if (!searchedTimes) {
    return null
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${bookingDate}T${searchedTimes[0]}`),
        lte: new Date(`${bookingDate}T${searchedTimes[searchedTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTableObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTableObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.table_id]: true,
        };
      }, {});
  });
  
  const restaurantTable = restaurant.tables;

  const searchedTimesWithTables = searchedTimes.map((searchTime) => {
    return {
      date: new Date(`${bookingDate}T${searchTime}`),
      time: searchTime,
      tables: restaurantTable,
    };
  });

  searchedTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTableObj[t.date.toISOString()]) {
        if (bookingTableObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchedTimesWithTables;
}