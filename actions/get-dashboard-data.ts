import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getDashboardData = async (storeId: string) => {
  const [paidOrders, stockCount] = await Promise.all([
    prismadb.order.findMany({
      where: {
        storeId,
        isPaid: true,
      },
      select: {
        createdAt: true,
        orderItems: {
          select: {
            quantity: true,
            productVariant: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    }),
    prismadb.product.count({
      where: {
        storeId,
        isArchived: false,
      },
    }),
  ]);

  const monthlyRevenue: Record<number, number> = {};
  let totalRevenue = 0;

  paidOrders.forEach((order) => {
    const orderTotal = order.orderItems.reduce((sum, item) => {
      return sum + item.productVariant.price.toNumber() * item.quantity;
    }, 0);
    const month = order.createdAt.getMonth();

    totalRevenue += orderTotal;
    monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + orderTotal;
  });

  const graphRevenue: GraphData[] = months.map((name, index) => ({
    name,
    total: monthlyRevenue[index] ?? 0,
  }));

  return {
    totalRevenue,
    salesCount: paidOrders.length,
    stockCount,
    graphRevenue,
  };
};
