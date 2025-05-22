import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import IntroductionSection from "@/components/introduction-section"
import BooksSection from "@/components/books-section"
import AboutSection from "@/components/about-section"
import TestimonialsSection from "@/components/testimonials-section"
import BlogSection from "@/components/blog-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <IntroductionSection />
      <BooksSection />
      <AboutSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
      <BackToTop />
    </main>
  )
}
