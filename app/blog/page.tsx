import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { retryOperation } from "@/lib/utils";

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

export default async function BlogPage() {
  let articles: BlogArticle[] = [];
  let errorFetching = false;

  try {
    // Fetch articles from your API route
    const response = await retryOperation(async () => {
        return await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/blog`, {
            cache: 'no-store' // Ensure fresh data on every request
        });
    }, 3);

    if (!response.ok) {
      throw new Error(`Failed to fetch blog articles: ${response.statusText}`);
    }
    articles = await response.json();
    // Ensure createdAt is parsed as Date object for formatting
    articles = articles.map(article => ({
      ...article,
      createdAt: new Date(article.createdAt)
    }));

  } catch (error) {
    console.error("Error fetching blog articles for public page:", error);
    errorFetching = true;
  }

  if (errorFetching) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <p className="text-red-500">Failed to load blog articles. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Articles</h1>
      {articles.length === 0 ? (
        <p className="text-center text-gray-600">No published articles yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="block">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative w-full h-48 bg-gray-200">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'; // Fallback image on error
                        e.currentTarget.alt = 'Image failed to load';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Published on {format(article.createdAt, 'MMM dd, yyyy')}</span>
                    <span className="font-medium text-blue-600">Read More &rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}