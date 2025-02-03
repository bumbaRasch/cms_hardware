import { faker } from '@faker-js/faker';
import prisma from '../src/configs/database.js';

async function createRandomUser() {
    return {
        USER_ID: faker.string.uuid(),
        FIRST_NAME: faker.person.firstName(),
        LAST_NAME: faker.person.lastName(),
        USERNAME: faker.person.fullName(),
        EMAIL: faker.internet.email(),
        PASSWORD: faker.internet.password(),
        CREATED_AT: faker.date.past(),
        UPDATED_AT: faker.date.recent(),
    };
}

async function seedUsers() {
    const users = [];
    for (let i = 0; i < 1000; i++) {
        users.push(createRandomUser());
    }

    await prisma.tbl_users.createMany({
        data: await Promise.all(users),
        skipDuplicates: true,
    });

    console.log('Seeded 1000 users');
}

seedUsers()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });