import Image from "next/image"
import Link from "next/link"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mr.%20Collins.jpg-qEPVyawA6o98ZPBwNLUPJsv32EvKVW.jpeg"
                alt="Mr. Collins"
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="section-title">About Collins</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Meet Collins, a seasoned English teacher from Nigeria, with a passion for making grammar accessible to
                learners of all levels. With years of experience in teaching English online, he has developed a unique
                approach to breaking down complex grammar concepts into easy-to-understand lessons.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Through the Collinspiration platform, he shares engaging content and guidance on various social media
                channels, helping thousands of learners improve their language skills. Despite not having a traditional
                English degree, his extensive training and dedication to teaching have earned him a reputation as a
                trusted and effective English tutor.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                With a gift for simplifying the complexities of English grammar, he has written this book to provide
                learners with a comprehensive resource to master the language. Whether you&apos;re a student, professional, {/* Corrected: Escaped apostrophe */}
                or lifelong learner, he is committed to helping you achieve your English language goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#contact" className="btn-primary">
                  Contact Mr. Collins
                </Link>
                <Link href="#testimonials" className="btn-tertiary">
                  Read Testimonials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
