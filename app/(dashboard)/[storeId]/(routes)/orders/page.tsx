import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { Item } from "@radix-ui/react-dropdown-menu";
import { formatter } from "@/lib/utils";
interface OrdersPageProps {
  params: { storeId: string };
}

const OrdersPage: React.FC<OrdersPageProps> = async ({ params }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
              options: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    isPaid: order.isPaid,
    products: order.orderItems
      .map((orderItem) => orderItem.productVariant.product.name)
      .join(", "),
    variant: order.orderItems
      .map((orderItem) =>
        orderItem.productVariant.options
          .map((option) => option.value)
          .join(", ")
      )
      .join(" | "),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, order) => {
        return total + Number(order.productVariant.price);
      }, 0)
    ),
    createdAt: format(order.createdAt, "yyyy-MM-dd"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
