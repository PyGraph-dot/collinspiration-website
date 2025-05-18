import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import HeroSection from "@/components/hero-section"
import IntroductionSection from "@/components/introduction-section"
import BooksSection from "@/components/books-section"
import AboutSection from "@/components/about-section"
import TestimonialsSection from "@/components/testimonials-section"
import BlogSection from "@/components/blog-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <IntroductionSection />
        <BooksSection />
        <AboutSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
