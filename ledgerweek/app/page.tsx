import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/marketing/hero";
import FeatureGrid from "@/components/marketing/feature-grid";
import Testimonials from "@/components/marketing/testimonials";
import FAQ from "@/components/marketing/faq";
import CTASection from "@/components/marketing/cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
