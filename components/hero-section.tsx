import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Background%20image.jpg-SS47PavcrPZ4UOGfbUsLJaeG4oV3rH.jpeg"
          alt="Library background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Inspiring English Excellence Through Literature
          </h1>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Discover the transformative power of language with Collins&apos; carefully crafted educational books designed {/* Corrected: Escaped apostrophe */}
            to elevate your English proficiency.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#books" className="btn-primary">
              Explore Books
            </Link>
            <Link href="#about" className="btn-secondary">
              About Mr. Collins
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}