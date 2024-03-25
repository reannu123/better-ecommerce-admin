import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          productVariant: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  paidOrders.forEach((order) => {
    const month = new Date(order.createdAt).getMonth();
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.productVariant.price.toNumber();
    }, 0);

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = orderTotal;
    } else {
      monthlyRevenue[month] += orderTotal;
    }
  });

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

  const graphData: GraphData[] = months.map((month, index) => ({
    name: month,
    total: monthlyRevenue[index] || 0,
  }));

  return graphData;
};
