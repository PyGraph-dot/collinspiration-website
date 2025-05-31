// prisma/seed.ts
import { PrismaClient, Role, ArticleStatus } from '@prisma/client'; // Make sure ArticleStatus is imported!
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // --- Seed Categories ---
  console.log('Seeding categories...');
  const categoriesToSeed = [
    { id: 'clsg0001', name: 'Fiction', status: 'active', description: 'Fictional books' },
    { id: 'clsg0002', name: 'Non-Fiction', status: 'active', description: 'Books based on facts' },
    { id: 'clsg0003', name: 'Fantasy', status: 'active', description: 'Books with magical elements' },
    { id: 'clsg0004', name: 'Programming', status: 'active', description: 'Books about coding' },
    { id: 'clsg0005', name: 'Self-Help', status: 'active', description: 'Books for personal development' },
  ];

  for (const cat of categoriesToSeed) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('Categories seeded successfully!');

  // --- Seed Admin User ---
  console.log('Seeding admin user...');
  const adminEmail = 'admin@collinspiration.com';
  const adminPassword = 'adminpassword';
  const hashedPassword = await hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin User',
      password: hashedPassword, // <--- CORRECTED: Changed from 'hashedPassword' to 'password'
      role: Role.ADMIN,
    },
    create: {
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword, // <--- CORRECTED: Changed from 'hashedPassword' to 'password'
      role: Role.ADMIN,
    },
  });
  console.log(`Admin user '${adminEmail}' seeded successfully!`);

  // --- Seed Blog Articles ---
  console.log('Seeding blog articles...');
  const blogArticlesToSeed = [
    {
      title: 'The Art of Learning Anything Faster',
      slug: 'the-art-of-learning-anything-faster',
      content: 'Learning new skills can be daunting, but with the right strategies, you can accelerate your progress. This article explores effective techniques for rapid skill acquisition, from spaced repetition to active recall. Discover how to optimize your study sessions and retain information more efficiently, transforming your learning journey into a rewarding experience.',
      coverImage: 'https://res.cloudinary.com/dhptnfoox/image/upload/v1700000000/collinspiration-blog/learning-speed.jpg',
      status: ArticleStatus.DRAFT, // CHANGED from PUBLISHED
    },
    {
      title: 'Mastering Time Management for Productivity',
      slug: 'mastering-time-management-for-productivity',
      content: 'Time is a finite resource, and mastering its management is key to unlocking peak productivity. This article delves into various time management techniques, including the Pomodoro Technique, Eisenhower Matrix, and time blocking. Learn how to prioritize tasks, minimize distractions, and create a schedule that aligns with your goals, leading to greater efficiency and less stress.',
      coverImage: 'https://res.cloudinary.com/dhptnfoox/image/upload/v1700000000/collinspiration-blog/time-management.jpg',
      status: ArticleStatus.DRAFT, // CHANGED from PUBLISHED
    },
    {
      title: 'The Power of Positive Thinking in Daily Life',
      slug: 'the-power-of-positive-thinking-in-daily-life',
      content: 'Cultivating a positive mindset can profoundly impact your well-being and success. This article explores the science behind positive thinking and offers practical tips for incorporating it into your daily routine. From gratitude practices to reframing challenges, discover how optimism can enhance your resilience, improve relationships, and open doors to new opportunities.',
      coverImage: 'https://res.cloudinary.com/dhptnfoox/image/upload/v1700000000/collinspiration-blog/positive-thinking.jpg',
      status: ArticleStatus.DRAFT,
    },
  ];

  for (const article of blogArticlesToSeed) {
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log('Blog articles seeded successfully!');

  // --- Seed Books (Optional - uncomment and add if you want initial books) ---
  // console.log('Seeding example books...');
  // const fictionCategory = await prisma.category.findUnique({ where: { name: 'Fiction' } });
  // if (fictionCategory) {
  //   await prisma.book.upsert({
  //     where: { title: 'The Great Novel' },
  //     update: {},
  //     create: {
  //       title: 'The Great Novel',
  //       description: 'A captivating story.',
  //       coverImage: 'https://placehold.co/400x600/aabbcc/ffffff?text=Great+Novel',
  //       price: 19.99,
  //       categoryId: fictionCategory.id,
  //       type: 'MY_BOOK', // Use enum value
  //       status: 'PUBLISHED', // Use enum value
  //     },
  //   });
  // }
  // console.log('Example books seeded successfully!');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
