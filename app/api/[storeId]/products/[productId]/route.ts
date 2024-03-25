import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        variants: {
          include: {
            options: true,
          },
        },
        productVariants: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            options: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      description,
      price,
      categoryId,
      images,
      isFeatured,
      isArchived,
      variants,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("At least one image is required", {
        status: 400,
      });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!variants) {
      return new NextResponse("Variants array is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Fetch the product with its variants and options
    const oldProduct = await prismadb.product.findUnique({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
      include: {
        variants: {
          include: {
            options: true,
          },
        },
      },
    });

    // Delete each variant's options
    if (oldProduct) {
      for (const variant of oldProduct.variants) {
        await prismadb.variant.update({
          where: { id: variant.id },
          data: {
            options: {
              deleteMany: {},
            },
          },
        });
      }
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
      data: {
        name,
        description,
        price,
        categoryId,
        images: {
          deleteMany: {},
        },
        variants: {
          deleteMany: {},
        },
        productVariants: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
      data: {
        images: {
          createMany: {
            data: images.map((image: string) => image),
          },
        },
        variants: {
          create: variants.map((variant: any) => ({
            title: variant.title,
            options: {
              create: variant.options.map((option: { value: string }) => ({
                value: option.value,
                price: price,
              })),
            },
          })),
        },
      },
      include: {
        images: true,
        category: true,
        variants: {
          include: {
            options: true,
          },
        },
      },
    });

    const productWithVariants = await prismadb.product.findFirst({
      where: {
        id: product.id,
      },
      include: {
        variants: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!productWithVariants || !productWithVariants.variants.length) {
      console.log("No variants found");
      const productWithProductVariants = await prismadb.product.update({
        where: { id: product.id },
        data: {
          productVariants: {
            create: {
              price: price,
              availability: 888,
            },
          },
        },
      });
      return NextResponse.json(productWithProductVariants);
    }
    const updatedVariants = productWithVariants.variants;

    const optionCombinations = updatedVariants.reduce(
      (combinations: any[], variant: { options: any[] }) => {
        const newCombinations: any[] = [];
        variant.options.forEach((option: any) => {
          if (combinations.length === 0) {
            newCombinations.push([option]);
          } else {
            combinations.forEach((combination: any) => {
              newCombinations.push([...combination, option]);
            });
          }
        });
        return newCombinations;
      },
      []
    );

    const productWithProductVariants = await prismadb.product.update({
      where: { id: product.id },
      data: {
        productVariants: {
          create: optionCombinations.map((combination: any[]) => ({
            options: {
              connect: combination.map((option) => ({ id: option.id })),
            },
            price: price,
            availability: 999,
          })),
        },
      },
    });

    return NextResponse.json(productWithProductVariants);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
