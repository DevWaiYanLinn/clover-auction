import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const categories = [
        {
            name: "Art & Collectibles",
            subcategories: [
                { name: "Paintings" },
                { name: "Sculptures" },
                { name: "Photography" },
                { name: "Coins" },
                { name: "Stamps" },
                { name: "Vintage Toys" },
            ],
        },
        {
            name: "Fashion",
            subcategories: [
                { name: "Men's Clothing" },
                { name: "Women's Clothing" },
                { name: "Children's Clothing" },
                { name: "Handbags" },
                { name: "Jewelry" },
                { name: "Watches" },
            ],
        },
        {
            name: "Electronics",
            subcategories: [
                { name: "Smartphones" },
                { name: "Tablets" },
                { name: "Accessories" },
                { name: "Laptops" },
                { name: "Desktops" },
                { name: "Peripherals" },
            ],
        },
        {
            name: "Home & Garden",
            subcategories: [
                { name: "Living Room Furniture" },
                { name: "Bedroom Furniture" },
                { name: "Office Furniture" },
                { name: "Lawn Mowers" },
                { name: "Planters" },
                { name: "Garden Furniture" },
            ],
        },
        {
            name: "Sports & Outdoors",
            subcategories: [
                { name: "Bicycles" },
                { name: "Gym Equipment" },
                { name: "Camping Gear" },
                { name: "Fishing Gear" },
                { name: "Hiking Equipment" },
                { name: "Water Sports Equipment" },
            ],
        },
        {
            name: "Vehicles",
            subcategories: [
                { name: "Sedans" },
                { name: "SUVs" },
                { name: "Vintage Cars" },
                { name: "Cruisers" },
                { name: "Sport Bikes" },
                { name: "Dirt Bikes" },
            ],
        },
        {
            name: "Toys & Hobbies",
            subcategories: [
                { name: "Action Figures" },
                { name: "Board Games" },
                { name: "Educational Toys" },
                { name: "Model Kits" },
                { name: "Drones" },
                { name: "Collectible Cards" },
            ],
        },
    ];

    const roles = [{ name: "admin" }, { name: "buyer/seller" }];

    await prisma.role.createMany({
        data: roles,
    });

    const admin = await prisma.role.findFirst({
        where: { name: "admin" },
    });

    const buyerSeller = await prisma.role.findFirst({
        where: { name: "buyer/seller" },
    });

    const password =
        "$2a$10$duimpsGsK23hgDx1jFEch.DKAXOyr9LBNYFHe51mIyBtQVFvZmEm2";

    await prisma.user.create({
        data: {
            name: "admin",
            email: "admin@test.com",
            password,
            reputation: 3,
            gender: true,
            emailVerifiedAt: new Date(),
            balance: 0,
            roles: {
                create: [{ roleId: admin!.id }],
            },
        },
    });

    await prisma.user.create({
        data: {
            name: "user",
            email: "user@test.com",
            password,
            reputation: 3,
            gender: true,
            balance: 0,
            roles: {
                create: [{ roleId: buyerSeller!.id }],
            },
        },
    });

    for (const category of categories) {
        await prisma.category.create({
            data: {
                name: category.name,
                subcategories: { create: category.subcategories },
            },
        });
    }
}

main()
    .then(async () => {
        console.log("aa");
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
