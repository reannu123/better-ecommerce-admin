import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
      variants: {
        include: {
          options: true,
        },
      },
      productVariants: {
        include: {
          options: true,
        },
      },
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col flex items-center justify-center">
      <div className="flex-1 space-y-4 p-8 pt-6 w-5/6 lg:w-3/5">
        <ProductForm
          initialData={
            product && {
              ...product,
              price: product?.price.toNumber(),
              variants: product?.variants.map((variant) => ({
                ...variant,
                options: variant.options.map((option) => ({
                  ...option,
                  price: option.price.toNumber(),
                })),
              })),
              productVariants: product?.productVariants.map(
                (productVariant) => ({
                  ...productVariant,
                  options: productVariant.options.map((option) => ({
                    ...option,
                    price: option.price.toNumber(),
                  })),
                })
              ),
            }
          }
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ProductPage;
