import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { retryOperation } from "@/lib/utils"; 
import Link from 'next/link'; //

// Define a type for your blog articles (should match Prisma model)
interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: Date;
  updatedAt: Date;
}

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = params;
  let article: BlogArticle | null = null;

  try {
    // Fetch the specific article from your API route
    const response = await retryOperation(async () => {
        return await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blog/${slug}`, {
            cache: 'no-store' // Ensure fresh data on every request
        });
    }, 3);

    if (!response.ok) {
      if (response.status === 404) {
        notFound(); // If article not found, show Next.js 404 page
      }
      throw new Error(`Failed to fetch blog article: ${response.statusText}`);
    }
    article = await response.json();
    // Ensure createdAt is parsed as Date object for formatting
    if (article) {
      article.createdAt = new Date(article.createdAt);
    }

  } catch (error) {
    console.error(`Error fetching blog article with slug ${slug}:`, error);
    // If there's a persistent error after retries, show 404 or an error message
    notFound();
  }

  if (!article) {
    notFound(); // Should be caught by the try/catch or notFound() above, but as a fallback
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
        {article.title}
      </h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        Published on {format(article.createdAt, 'MMMM dd, yyyy')}
      </p>

      {article.coverImage && (
        <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg'; // Fallback image on error
              e.currentTarget.alt = 'Image failed to load';
            }}
          />
        </div>
      )}

      <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
        {/* Render content. If content is Markdown, you might need a Markdown renderer here */}
        <p>{article.content}</p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/blog" className="text-blue-600 hover:underline text-lg">
          &larr; Back to Blog
        </Link>
      </div>
    </div>
  );
}