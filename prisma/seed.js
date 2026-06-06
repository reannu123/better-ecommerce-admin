const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.SEED_CLERK_USER_ID;
  const existingStore = await prisma.store.findFirst({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "asc" },
  });

  if (!existingStore && !userId) {
    throw new Error(
      "No store exists. Create one in the app or set SEED_CLERK_USER_ID before seeding."
    );
  }

  const store =
    existingStore ||
    (await prisma.store.create({
      data: {
        id: "demo-store",
        name: "Demo Store",
        userId,
      },
    }));
  const idSuffix = store.id;

  const billboard = await prisma.billboard.upsert({
    where: { id: `demo-billboard-${idSuffix}` },
    update: {
      label: "Summer Collection",
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      storeId: store.id,
    },
    create: {
      id: `demo-billboard-${idSuffix}`,
      label: "Summer Collection",
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      storeId: store.id,
    },
  });

  const category = await prisma.category.upsert({
    where: { id: `demo-category-${idSuffix}` },
    update: {
      name: "Apparel",
      storeId: store.id,
      billboardId: billboard.id,
    },
    create: {
      id: `demo-category-${idSuffix}`,
      name: "Apparel",
      storeId: store.id,
      billboardId: billboard.id,
    },
  });

  const product = await prisma.product.upsert({
    where: { id: `demo-product-${idSuffix}` },
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
      id: `demo-product-${idSuffix}`,
      name: "Classic Hoodie",
      description: "A seeded product for local dashboard development.",
      price: 1499,
      isFeatured: true,
      storeId: store.id,
      categoryId: category.id,
    },
  });

  const variant = await prisma.variant.upsert({
    where: { id: `demo-variant-${idSuffix}` },
    update: { title: "Size", productId: product.id },
    create: {
      id: `demo-variant-${idSuffix}`,
      title: "Size",
      productId: product.id,
    },
  });

  const option = await prisma.option.upsert({
    where: { id: `demo-option-${idSuffix}` },
    update: { value: "Medium", price: 0, variantId: variant.id },
    create: {
      id: `demo-option-${idSuffix}`,
      value: "Medium",
      price: 0,
      variantId: variant.id,
    },
  });

  const productVariant = await prisma.productVariant.upsert({
    where: { id: `demo-product-variant-${idSuffix}` },
    update: {
      price: 1499,
      availability: 25,
      productId: product.id,
      options: { set: [{ id: option.id }] },
    },
    create: {
      id: `demo-product-variant-${idSuffix}`,
      price: 1499,
      availability: 25,
      productId: product.id,
      options: { connect: [{ id: option.id }] },
    },
  });

  await prisma.image.upsert({
    where: { id: `demo-image-${idSuffix}` },
    update: {
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      productId: product.id,
    },
    create: {
      id: `demo-image-${idSuffix}`,
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      productId: product.id,
    },
  });

  const monthlyQuantities = [1, 3, 2, 5, 4, 7];
  const now = new Date();

  for (const [index, quantity] of monthlyQuantities.entries()) {
    const orderDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 15)
    );
    const monthKey = orderDate.toISOString().slice(0, 7);
    const orderId = `demo-order-${idSuffix}-${monthKey}`;

    const order = await prisma.order.upsert({
      where: { id: orderId },
      update: {
        isPaid: true,
        phone: "09171234567",
        address: "Manila, Philippines",
        storeId: store.id,
        createdAt: orderDate,
      },
      create: {
        id: orderId,
        isPaid: true,
        phone: "09171234567",
        address: "Manila, Philippines",
        storeId: store.id,
        createdAt: orderDate,
      },
    });

    await prisma.orderItem.upsert({
      where: { id: `demo-order-item-${idSuffix}-${monthKey}` },
      update: {
        quantity,
        orderId: order.id,
        productVariantId: productVariant.id,
      },
      create: {
        id: `demo-order-item-${idSuffix}-${monthKey}`,
        quantity,
        orderId: order.id,
        productVariantId: productVariant.id,
      },
    });
  }

  console.log(
    `Seeded catalog data and ${monthlyQuantities.length} months of paid orders for ${store.name}.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
