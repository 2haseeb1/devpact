// prisma/seed.ts

import { PrismaClient, CheckInStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Meaningful English templates for Pacts
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

// Meaningful English templates for Check-ins, corresponding to their status
const checkInMessages = {
  [CheckInStatus.ON_TRACK]: [
    "Making steady progress this week. The core logic is implemented.",
    "Feeling productive. Just successfully integrated the third-party API.",
    "Everything is going according to plan. I'm on schedule to meet the deadline.",
    "Pushed a new commit with the latest updates. The feature is really taking shape now.",
    "I managed to solve a tricky bug today. It feels great to be moving forward again.",
  ],
  [CheckInStatus.MILESTONE]: [
    "Huge milestone reached! The authentication and user profiles are now fully functional.",
    "Big news! Deployed the first alpha version to Vercel. It's live!",
    "Finally finished the data visualization component. This was a tough but rewarding challenge.",
    "I'm officially halfway through the online course. Celebrating this small but important win!",
    "The MVP is feature-complete! Now focusing on testing and bug fixes before the launch.",
  ],
  [CheckInStatus.BLOCKED]: [
    "I'm feeling a bit stuck on a state management issue with Zustand. It's more complex than I initially thought.",
    "Currently blocked by a rate limit on an external API. I've reached out to their support team.",
    "Running into some webpack configuration problems. The build keeps failing.",
    "My motivation took a dip this week. I think I need to take a short break to recharge and refocus.",
    "The documentation for this library is a bit unclear, which is slowing down my progress.",
  ],
};

// Main seeding function
async function main() {
  console.log("🌱 Starting to seed the database...");

  // --- Clear Existing Data ---
  console.log("🧹 Clearing old data...");
  await prisma.kudo.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.pact.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany(); // User is last before Account/Session due to relations
  console.log("✅ Old data cleared successfully.");

  // --- Create Users ---
  console.log("👤 Creating users...");
  const users = await Promise.all(
    Array.from({ length: 15 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          username: faker.internet
            .userName()
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

  // --- Create Pacts ---
  console.log("🤝 Creating meaningful pacts...");
  const pacts = [];
  for (const user of users) {
    // Each user gets 1 or 2 random pacts
    const userPactTemplates = faker.helpers
      .shuffle(pactTemplates)
      .slice(0, faker.number.int({ min: 1, max: 2 }));

    for (const template of userPactTemplates) {
      const pact = await prisma.pact.create({
        data: {
          authorId: user.id,
          title: template.title,
          description: faker.lorem.paragraph(3), // A generic description is fine
          deadline: faker.date.future({ years: 1 }),
          isCompleted: faker.datatype.boolean(0.2), // 20% chance the pact is already completed
          tags: template.tags,
        },
      });
      pacts.push(pact);
    }
  }
  console.log(`✅ Created ${pacts.length} pacts.`);

  // --- Create Check-ins ---
  console.log("📊 Creating realistic check-ins...");
  const checkIns = [];
  for (const pact of pacts) {
    // Only create check-ins for pacts that are not yet completed
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
            // 20% chance of having an image URL (e.g., a screenshot of code)
            imageUrl: faker.datatype.boolean(0.2)
              ? faker.image.urlLoremFlickr({ category: "technics" })
              : null,
          },
        });
        checkIns.push(checkIn);
      }
    }
  }
  console.log(`✅ Created ${checkIns.length} check-ins.`);

  // --- Create Kudos ---
  console.log("💖 Giving some kudos...");
  let kudoCount = 0;
  if (checkIns.length > 0) {
    for (const checkIn of checkIns) {
      // 0 to 5 other users will give a kudo
      const kudoGivers = faker.helpers
        .shuffle(users)
        .slice(0, faker.number.int({ min: 0, max: 5 }));

      for (const user of kudoGivers) {
        // Users can't give a kudo to their own check-in
        if (user.id !== checkIn.authorId) {
          await prisma.kudo.create({
            data: {
              checkInId: checkIn.id,
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

// Execute the main function and handle any errors
main()
  .catch((e) => {
    console.error("❌ An error occurred while seeding the database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Finally, disconnect from the database
    await prisma.$disconnect();
  });
