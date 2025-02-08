import { faker } from '@faker-js/faker';
import prisma from '../src/configs/prisma.js';

async function createRandomHardware() {
  return {
    HA_NAME: faker.commerce.productName(),
    HA_TYPE: faker.number.int({ min: 1, max: 5 }),
    HA_MANUFACTURER: faker.company.name(),
    HA_MODEL: faker.commerce.product(),
    HA_SERIAL_NUMBER: faker.string.uuid(),
    HA_PURCHASE_DATE: faker.date.past(),
    HA_WARRANTY_EXPIRY_DATE: faker.date.future(),
    HA_LOCATION: faker.number.int({ min: 1, max: 5 }),
    HA_STATUS: faker.number.int({ min: 1, max: 5 }),
    HA_LAST_MAINTENANCE_DATE: faker.date.past(),
    HA_NOTES: faker.lorem.sentence(),
    HA_SIM_CARD: faker.number.int({ min: 1, max: 1000 }),
    HA_STORE: faker.number.int({ min: 1, max: 5 }),
    HA_SUPPLIER: faker.number.int({ min: 1, max: 5 }),
    HA_COST: parseFloat(faker.commerce.price()),
    HA_CURRENCY: faker.number.int({ min: 1, max: 5 }),
    HA_CONDITION: faker.helpers.arrayElement(['New', 'Used', 'Refurbished']),
    HA_DEPLOYMENT_DATE: faker.date.past(),
    HA_RETIREMENT_DATE: faker.date.future(),
    HA_IP_ADDRESS: faker.internet.ip(),
    HA_MAC_ADDRESS: faker.internet.mac(),
  };
}

async function seedHardware() {
  const hardwareItems = [];
  for (let i = 0; i < 1000; i++) {
    const item = await createRandomHardware();
    hardwareItems.push(item);
  }

  try {
    const result = await prisma.tbl_hardware.createMany({
      data: hardwareItems,
      skipDuplicates: true,
    });
    console.log('Seeded hardware items:', result);
  } catch (error) {
    console.error('Error seeding hardware items:', error);
  }
}

seedHardware()
  .catch((e) => {
    console.error('Error in seedHardware:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });