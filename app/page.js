"use client";

import HomePage from "@/component/home/Home";
import SnapBooking from "@/component/snapbooking/SnapBooking";
import Rooms from "@/component/rooms/Rooms";
import Team from "@/component/team/Team";
import FAQSection from "@/component/faqsection/Faqsection ";
import Service from "@/component/service/Service";

import Testimonial from "@/component/testimonial/Testimonial";
import Blog from "@/component/blog/Blog";
export default function Home() {
  return (
    <div>
      <HomePage />

      <Rooms />
      <SnapBooking />
      <Team />
      {/* <Testimonial /> */}
      <Service />
      <FAQSection />
      <Blog />
    </div>
  );
}
