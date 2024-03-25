"use client";
import * as z from "zod";
import {
  Category,
  Image,
  Option,
  Product,
  Variant,
  ProductVariant,
} from "@prisma/client";
import { FileSpreadsheet, Trash } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { NestedForm } from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/components/nested-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(300),
  categoryId: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  variants: z.array(
    z.object({
      title: z.string().min(1),
      options: z.array(z.object({ value: z.string().min(1) })).min(1),
    })
  ),
});

type ProductFormValues = z.infer<typeof formSchema>;
type ProductWithNumberPrice = Omit<Product, "price"> & { price: number };
type OptionWithNumberPrice = Omit<Option, "price"> & { price: number };
interface ProductFormProps {
  initialData:
    | (ProductWithNumberPrice & {
        images: Image[];
        variants: (Variant & {
          options: OptionWithNumberPrice[];
        })[];
        productVariants: (ProductVariant & {
          options: OptionWithNumberPrice[];
        })[];
      })
    | null;
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Product" : "New Product";
  const description = initialData
    ? "Edit your store's product."
    : "Create a new product for your store.";
  const toastMessage = initialData
    ? "Product changes saved!"
    : "Product created!";
  const action = initialData ? "Save changes" : "Create product";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          variants: initialData.variants.map((variant) => ({
            ...variant,
            options: variant.options.map((option) => ({
              ...option,
              price: parseFloat(String(option.price)),
            })),
          })),
        }
      : {
          name: "",
          description: "",
          categoryId: "",
          price: 0,
          images: [],
          isFeatured: false,
          isArchived: false,
          variants: [{ title: "", options: [{ value: "" }] }],
        },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      console.log(data);
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error(`Failed to save changes. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success("Product deleted!");
    } catch (error) {
      toast.error("Make sure to remove all categories using this product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder="Product name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={loading}
                      placeholder="400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={loading}
                      placeholder="Type a description for your product"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-1">
              <h3 className="text-sm font-medium ">Product Variants</h3>
              <div className="space-y-3 px-0 py-2">
                {variantFields.map((variantField, variantIndex) => {
                  return (
                    <Card key={variantField.id}>
                      <FormField
                        control={form.control}
                        name={`variants.${variantIndex}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <CardHeader className="p-4 pb-0">
                              <FormLabel>Variant Name</FormLabel>
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 pb-4">
                              <div className="flex items-center space-x-3 ">
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={loading}
                                    placeholder="Size"
                                  />
                                </FormControl>
                                <Button
                                  onClick={() => removeVariant(variantIndex)}
                                  type="button"
                                  variant="destructive"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>

                              <FormMessage />
                              <NestedForm
                                form={form}
                                nestIndex={variantIndex}
                              />
                            </CardContent>
                          </FormItem>
                        )}
                      />
                    </Card>
                  );
                })}
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() =>
                    appendVariant({
                      title: "",
                      options: [{ value: "" }],
                    })
                  }
                >
                  Add Variant
                </Button>
              </div>
            </div>
            {initialData?.productVariants && (
              <div className="col-span-1">
                <h3 className="text-sm font-medium ">Product Variants</h3>
                <div className="space-y-3 px-0 py-2">
                  {initialData.productVariants.map(
                    (productVariant, productVariantIndex) => {
                      return (
                        <Card key={productVariant.id}>
                          <CardHeader className="p-4 pb-0">
                            <CardTitle>{productVariant.productId}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 px-4 pb-4">
                            <div className="grid grid-cols-2 gap-4">
                              {productVariant.options.map(
                                (option, optionIndex) => {
                                  return (
                                    <Card key={option.id}>
                                      <CardContent className="flex items-center space-x-3">
                                        <CardTitle>{option.value}</CardTitle>
                                        <CardTitle>${option.price}</CardTitle>
                                      </CardContent>
                                    </Card>
                                  );
                                }
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
