import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
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
    });

    // Get variants from the created product

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

    if (!productWithVariants) {
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
    console.log(" [PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
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
                variants: true,
              },
            },
            options: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log(" [PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
