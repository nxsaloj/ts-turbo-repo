import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create collections
  const collections = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.collection.create({
        data: {
          name: faker.commerce.department(),
          description: faker.lorem.sentence(),
        },
      })
    )
  );

  // Create products with variants, options, and optionValues
  for (let i = 0; i < 5; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        image: faker.image.url(),
        collections: {
          connect: collections.map((collection) => ({ id: collection.id })),
        },
        options: {
          create: Array.from({ length: 2 }).map(() => ({
            name: faker.commerce.productAdjective(),
            values: {
              create: Array.from({ length: 3 }).map(() => ({
                value: faker.color.human(),
              })),
            },
          })),
        },
        variants: {
          create: Array.from({ length: 3 }).map(() => ({
            sku: faker.string.uuid(),
            price: faker.number.int({ min: 10, max: 1000 }),
            stock: faker.number.int({ min: 1, max: 100 }),
            description: faker.lorem.sentence(),
            image: faker.image.url(),
          })),
        },
      },
    });

    // Link optionValues to variants
    const options = await prisma.option.findMany({
      where: { productId: product.id },
      include: { values: true },
    });

    const variants = await prisma.variant.findMany({
      where: { productId: product.id },
    });

    for (const variant of variants) {
      for (const option of options) {
        const randomValue =
          option.values[
            faker.number.int({ min: 0, max: option.values.length - 1 })
          ];
        if (randomValue) {
          await prisma.optionValue.update({
            where: { id: randomValue.id },
            data: {
              variants: {
                connect: { id: variant.id },
              },
            },
          });
        }
      }
    }
  }
}

main()
  .then(() => {
    console.log("Seeding complete!");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
