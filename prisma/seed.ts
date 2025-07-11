// prisma/seed.ts

import { PrismaClient, CheckInStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// "DevPact" অ্যাপ্লিকেশনের জন্য অর্থপূর্ণ Pact টাইটেল এবং ট্যাগ
const pactTemplates = [
  {
    title: "Learn Next.js App Router In-Depth",
    tags: ["#learning", "#nextjs", "#react"],
  },
  {
    title: "Build a Full-Stack Markdown Blog",
    tags: ["#project", "#fullstack", "#typescript"],
  },
  {
    title: "Master Advanced SQL Joins and Window Functions",
    tags: ["#database", "#sql", "#career"],
  },
  {
    title: "Make a Meaningful Contribution to an Open Source Project",
    tags: ["#opensource", "#community", "#github"],
  },
  {
    title: "Complete a Full Course on System Design Fundamentals",
    tags: ["#learning", "#systemdesign", "#interviewprep"],
  },
  {
    title: "Launch a SaaS MVP for Task Management",
    tags: ["#startup", "#saas", "#product"],
  },
  {
    title: "Write and Publish 5 Technical Articles",
    tags: ["#writing", "#blogging", "#career"],
  },
  {
    title: "Refactor the Authentication Module in a Legacy Project",
    tags: ["#work", "#refactoring", "#techdebt"],
  },
  {
    title: "Get AWS Certified as a Solutions Architect",
    tags: ["#aws", "#certification", "#cloud"],
  },
  {
    title: "Create a WebGL-Powered 3D Portfolio",
    tags: ["#frontend", "#webgl", "#portfolio"],
  },
];

// Check-in স্ট্যাটাসের সাথে সামঞ্জস্যপূর্ণ মেসেজের নমুনা
const checkInMessages: Record<CheckInStatus, string[]> = {
  [CheckInStatus.ON_TRACK]: [
    "Making steady progress this week. The core logic is implemented.",
    "Feeling productive. Just successfully integrated the third-party API.",
    "Everything is going according to the plan. I'm on schedule to meet the deadline.",
    "Pushed a new commit with the latest updates. The feature is really taking shape now.",
  ],
  [CheckInStatus.MILESTONE]: [
    "Huge milestone reached! The authentication and user profiles are now fully functional.",
    "Big news! Deployed the first alpha version to Vercel. It's live!",
    "Finally finished the data visualization component. This was a tough but rewarding challenge.",
  ],
  [CheckInStatus.BLOCKED]: [
    "I'm feeling a bit stuck on a state management issue with Zustand.",
    "Currently blocked by a rate limit on an external API.",
    "My motivation took a dip this week. Taking a short break to recharge.",
  ],
};

// মূল সিডিং ফাংশন
async function main() {
  console.log("🌱 Starting to seed the database...");

  // --- ডেটা পরিষ্কার করা (সঠিক ক্রমে) ---
  console.log("🧹 Clearing old data...");
  await prisma.kudo.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.pact.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Old data cleared successfully.");

  // --- ব্যবহারকারী তৈরি করা ---
  console.log("👤 Creating users...");
  const users = await Promise.all(
    Array.from({ length: 15 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          username: faker.internet
            .username()
            .toLowerCase()
            .replace(/[\W_]+/g, ""),
          email: faker.internet.email().toLowerCase(),
          image: faker.image.avatar(),
          emailVerified: faker.date.past(),
        },
      })
    )
  );
  console.log(`✅ Created ${users.length} users.`);

  // --- Pacts তৈরি করা ---
  console.log("🤝 Creating meaningful pacts...");
  const pacts = [];
  for (const user of users) {
    const userPactTemplates = faker.helpers
      .shuffle(pactTemplates)
      .slice(0, faker.number.int({ min: 1, max: 2 }));
    for (const template of userPactTemplates) {
      const pact = await prisma.pact.create({
        data: {
          authorId: user.id,
          title: template.title,
          description: faker.lorem.paragraph(2),
          deadline: faker.date.future({ years: 1 }),
          isCompleted: faker.datatype.boolean(0.2),
          tags: template.tags,
        },
      });
      pacts.push(pact);
    }
  }
  console.log(`✅ Created ${pacts.length} pacts.`);

  // --- Check-ins তৈরি করা ---
  console.log("📊 Creating realistic check-ins...");
  const checkIns = [];
  for (const pact of pacts) {
    // শুধুমাত্র অসম্পূর্ণ Pact-গুলোর জন্য Check-in তৈরি করা হচ্ছে
    if (!pact.isCompleted) {
      const checkInCount = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < checkInCount; i++) {
        const status = faker.helpers.arrayElement(Object.values(CheckInStatus));
        const content = faker.helpers.arrayElement(checkInMessages[status]);

        const checkIn = await prisma.checkIn.create({
          data: {
            pactId: pact.id,
            authorId: pact.authorId,
            content: content,
            status: status,
            createdAt: faker.date.between({
              from: pact.createdAt,
              to: new Date(),
            }),
            imageUrl: faker.datatype.boolean(0.15)
              ? faker.image.urlLoremFlickr({ category: "technics" })
              : null,
          },
        });
        checkIns.push(checkIn);
      }
    }
  }
  console.log(`✅ Created ${checkIns.length} check-ins.`);

  // --- Kudos তৈরি করা ---
  console.log("💖 Giving some kudos...");
  let kudoCount = 0;
  if (checkIns.length > 0) {
    for (const checkIn of checkIns) {
      const kudoGivers = faker.helpers
        .shuffle(users)
        .slice(0, faker.number.int({ min: 0, max: 7 }));

      for (const user of kudoGivers) {
        if (user.id !== checkIn.authorId) {
          // ডেটাবেসে 이미 kudo আছে কি না তা চেক করার দরকার নেই,
          // কারণ আমরা প্রতিবার সব ডেটা ডিলিট করে দিচ্ছি।
          await prisma.kudo.create({
            data: {
              checkInId: checkIn.id, // এখন checkInId ব্যবহার করা হচ্ছে
              userId: user.id,
            },
          });
          kudoCount++;
        }
      }
    }
  }
  console.log(`✅ Gave ${kudoCount} kudos.`);

  console.log("🎉 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ An error occurred while seeding the database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
