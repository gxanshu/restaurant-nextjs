import Header from "./components/Header";
import Form from "./components/Form";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient()

export interface searchParams {
  partySize: string;
  date: string
  time: string
}

export interface RestaurantType {
  id: number;
  name: string;
  main_image: string;
}

const fetchRestaurant = async (slug: string): Promise<RestaurantType> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      main_image: true
    },
  });

  if (!restaurant) {
    notFound()
  }

  return restaurant;
};

export default async function RestaurantReservation({
  params,
  searchParams,
}: {
  params: {slug: string}
  searchParams: searchParams;
}) {
  const restaurant = await fetchRestaurant(params.slug)
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header searchParams={searchParams} restaurant={restaurant}/>
        <Form searchParams={searchParams} slug={params.slug}/>
      </div>
    </div>
  );
}
