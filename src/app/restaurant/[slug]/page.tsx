import RestaurantNavBar from "./components/RestaurantNavBar";
import RestaurantTitle from "./components/RestaurantTitle";
import RestaurantRating from "./components/RestaurantRating";
import RestaurantDescription from "./components/RestaurantDescription";
import RestaurantImage from "./components/RestaurantImage";
import ReviewCard from "./components/ReviewCard";
import { PrismaClient, Review } from "@prisma/client";
import { notFound } from "next/navigation";
import Reservation from "./components/Reservation";

const prisma = new PrismaClient();

interface Props {
  params: {
    slug: string;
  };
}

interface RestaurantType {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
}

const fetchRestaurant = async (slug: string): Promise<RestaurantType> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true
    },
  });

  if (!restaurant) {
    notFound()
  }

  return restaurant;
};

export default async function RestaurantDetialsPage({ params }: Props) {
  const restaurant = await fetchRestaurant(params.slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <RestaurantTitle title={restaurant.name} />
        <RestaurantRating reviews={restaurant.reviews} />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImage images={restaurant.images} />
        <div>
          <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
            What {restaurant.reviews.length}{" "}
            {restaurant.reviews.length === 1 ? "person" : "people"} are saying
          </h1>
          <div>
            {restaurant.reviews.map((review) => (
              <ReviewCard review={review} key={review.id}/>
            ))}
          </div>
        </div>
      </div>
      <Reservation openTime={restaurant.open_time} closeTime={restaurant.close_time} slug={restaurant.slug}/>
    </>
  );
}
