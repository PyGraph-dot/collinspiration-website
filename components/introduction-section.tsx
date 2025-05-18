import Link from "next/link"

export default function IntroductionSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title">Welcome to Collinspiration</h2>
          <p className="section-subtitle">
            For over 5 Years, Mr. Collins has dedicated his career to transforming how students learn English. As a
            distinguished educator and author, he has developed a unique methodology that combines classical literature
            appreciation with practical language skills. His books are aimed with the intention of helping thousands of
            students worldwide achieve fluency and confidence in their English abilities.
          </p>
          <div className="text-center">
            <Link href="#books" className="btn-primary">
              Discover Our Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
