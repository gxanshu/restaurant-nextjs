import Card from "./components/Card";
import Header from "./components/Header";
import { PrismaClient, Location, Region, PRICE, Review } from "@prisma/client";

export interface RestaurantCardType {
  id: number
  name: string
  main_image: string
  location: Location
  region: Region
  price: PRICE
  slug: string
  reviews: Review[]
}

const prisma = new PrismaClient();

const fetchRestrurants = async (): Promise<RestaurantCardType[]> => {
  let restrurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      location: true,
      region: true,
      price: true,
      slug: true,
      reviews: true
    }
  });
  return restrurants;
};

export default async function Home() {
  const restrurants = await fetchRestrurants();

  // console.log({ restrurants });
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restrurants.map((restrurant) => (
          <Card restaurant={restrurant}/>
        ))}
      </div>
    </main>
  );
}
