import CarouselBanner from "@/components/section/carousel";

import { NavigationMenuDemo } from "@/components/section/menu";
export default function Home() {
  return (
    <div className="section1 flex flex-col justify-center items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-8">
        Clothes, Pants, Suits and more
      </h1>
      <NavigationMenuDemo />
      <CarouselBanner />
    </div>
  );
}
