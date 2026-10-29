import { SelectionProvider } from "@/components/SelectionProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Steps from "@/components/Steps";
import Examples from "@/components/Examples";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import OrderSheet from "@/components/OrderSheet";
import ScrollFX from "@/components/ScrollFX";

export default function Home() {
  return (
    <SelectionProvider>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Steps />
        <Examples />
        <Faq />
      </main>
      <Footer />
      <OrderSheet />
      <ScrollFX />
    </SelectionProvider>
  );
}
