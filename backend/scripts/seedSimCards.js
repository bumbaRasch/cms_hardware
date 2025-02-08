import { faker } from '@faker-js/faker';
import prisma from '../src/configs/prisma.js';

async function createRandomSimCard() {
  return {
    SIM_NUMBER: faker.phone.number('##########'),
    PROVIDER_ID: faker.number.int({ min: 1, max: 5 }),
    TARIFF_ID: faker.number.int({ min: 1, max: 5 }),
    LOC_ID: faker.number.int({ min: 1, max: 5 }),
    STATUS_ID: faker.number.int({ min: 1, max: 5 }),
    PIN1: faker.string.numeric(4),
    PUK1: faker.string.numeric(4),
    PIN2: faker.string.numeric(4),
    PUK2: faker.string.numeric(4),
    ACTIVATION_DATE: faker.date.past(),
    EXPIRATION_DATE: faker.date.future(),
    COMMENTS: faker.lorem.sentence(),
  };
}

async function seedSimCards() {
  const simCards = [];
  for (let i = 0; i < 1000; i++) {
    simCards.push(createRandomSimCard());
  }

  await prisma.tbl_sim_cards.createMany({
    data: await Promise.all(simCards),
    skipDuplicates: true,
  });

  console.log('Seeded 1000 SIM cards');
}

seedSimCards()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });