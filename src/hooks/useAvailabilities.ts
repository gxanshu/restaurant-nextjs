"use client";

import { Time } from "@/utils/convertToDisplayTime";
import axios from "axios";
import { useState } from "react";

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{time: Time; avaliable: boolean}[] | null>();
  const [error, setError] = useState<boolean | string>(false);

  const fetchAvailabilities = async ({
    slug,
    partySize,
    date,
    time,
  }: {
    slug: string;
    partySize: string;
    date: string;
    time: string;
  }) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/avalability`,
        {
          params: {
            partySize,
            date,
            time,
          },
        }
      );
      // console.log(response.data)
      setData(response.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
      console.log(error);
    }
  };

  return { loading, data, error, fetchAvailabilities };
}
