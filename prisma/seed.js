const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.SEED_CLERK_USER_ID;

  if (!userId) {
    throw new Error(
      "SEED_CLERK_USER_ID is required. Copy your Clerk user ID into .env before seeding."
    );
  }

  const store = await prisma.store.upsert({
    where: { id: "demo-store" },
    update: { name: "Demo Store", userId },
    create: { id: "demo-store", name: "Demo Store", userId },
  });

  const billboard = await prisma.billboard.upsert({
    where: { id: "demo-billboard" },
    update: {
      label: "Summer Collection",
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      storeId: store.id,
    },
    create: {
      id: "demo-billboard",
      label: "Summer Collection",
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      storeId: store.id,
    },
  });

  const category = await prisma.category.upsert({
    where: { id: "demo-category" },
    update: {
      name: "Apparel",
      storeId: store.id,
      billboardId: billboard.id,
    },
    create: {
      id: "demo-category",
      name: "Apparel",
      storeId: store.id,
      billboardId: billboard.id,
    },
  });

  const product = await prisma.product.upsert({
    where: { id: "demo-product" },
    update: {
      name: "Classic Hoodie",
      description: "A seeded product for local dashboard development.",
      price: 1499,
      isFeatured: true,
      isArchived: false,
      storeId: store.id,
      categoryId: category.id,
    },
    create: {
      id: "demo-product",
      name: "Classic Hoodie",
      description: "A seeded product for local dashboard development.",
      price: 1499,
      isFeatured: true,
      storeId: store.id,
      categoryId: category.id,
    },
  });

  const variant = await prisma.variant.upsert({
    where: { id: "demo-variant" },
    update: { title: "Size", productId: product.id },
    create: { id: "demo-variant", title: "Size", productId: product.id },
  });

  const option = await prisma.option.upsert({
    where: { id: "demo-option" },
    update: { value: "Medium", price: 0, variantId: variant.id },
    create: {
      id: "demo-option",
      value: "Medium",
      price: 0,
      variantId: variant.id,
    },
  });

  const productVariant = await prisma.productVariant.upsert({
    where: { id: "demo-product-variant" },
    update: {
      price: 1499,
      availability: 25,
      productId: product.id,
      options: { set: [{ id: option.id }] },
    },
    create: {
      id: "demo-product-variant",
      price: 1499,
      availability: 25,
      productId: product.id,
      options: { connect: [{ id: option.id }] },
    },
  });

  await prisma.image.upsert({
    where: { id: "demo-image" },
    update: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      productId: product.id,
    },
    create: {
      id: "demo-image",
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      productId: product.id,
    },
  });

  const order = await prisma.order.upsert({
    where: { id: "demo-order" },
    update: {
      isPaid: true,
      phone: "09171234567",
      address: "Manila, Philippines",
      storeId: store.id,
    },
    create: {
      id: "demo-order",
      isPaid: true,
      phone: "09171234567",
      address: "Manila, Philippines",
      storeId: store.id,
    },
  });

  await prisma.orderItem.upsert({
    where: { id: "demo-order-item" },
    update: {
      quantity: 1,
      orderId: order.id,
      productVariantId: productVariant.id,
    },
    create: {
      id: "demo-order-item",
      quantity: 1,
      orderId: order.id,
      productVariantId: productVariant.id,
    },
  });

  console.log(`Seeded Demo Store for Clerk user ${userId}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
