// import { useState, useEffect, Suspense } from "react";

// import HotelDetails from "@/component/Bookingdetails/BookingComponent";

// import { useSearchParams } from "next/navigation";
// export const dynamic = "force-dynamic";

// const ContentViewPage = () => {
//   const [content, setContent] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const searchParams = useSearchParams();

//   const search = searchParams.get("search");

//   useEffect(() => {
//     if (!search) return;

//     const fetchContent = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           `${process.env.API}/getsingleroom/${search}`
//         );

//         if (!response.ok) {
//           throw new Error("failed to  fetch content");
//         }

//         const data = await response.json();

//         setContent(data);
//       } catch (error) {
//         setError(error.message || "an error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContent();
//   }, [search]);

//   if (error) {
//     return <p>Error {error}</p>;
//   }

//   return (
//     <>
//       <HotelDetails
//         content={content}
//         loading={loading}
//         setLoading={setLoading}
//       />
//     </>
//   );
// };

// export default ContentViewPage;



'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HotelDetails from '@/component/Bookingdetails/BookingComponent';

export const dynamic = 'force-dynamic';

// 1️⃣ Child component using useSearchParams
function BookingContentFetcher() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    if (!search) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.API}/getsingleroom/${search}`);
        if (!response.ok) throw new Error("Failed to fetch content");
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [search]);

  if (error) return <p>Error: {error}</p>;

  return (
    <HotelDetails
      content={content}
      loading={loading}
      setLoading={setLoading}
    />
  );
}

// 2️⃣ Main page component that wraps the fetcher in Suspense
const ContentViewPage = () => {
  return (
    <Suspense fallback={<p>Loading booking details...</p>}>
      <BookingContentFetcher />
    </Suspense>
  );
};

export default ContentViewPage;
