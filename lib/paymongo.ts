import axios from "axios";
// convert to base64
interface RequestOptions {
  line_items?: lineItemsProps[];
  cancel_url?: string;
  success_url?: string;
}
export interface lineItemsProps {
  name: string;
  quantity?: number;
  amount: number;
  currency: "PHP";
  description?: string;
  images: string[];
}
export const sendPaymongo = async (options: any) => {
  const response = await axios
    .request(options)
    .then(function (response: any) {
      console.log(response.data);
      return response.data.data;
    })
    .catch(function (error: any) {
      console.error(error);
    });
  return response;
};

export const createOptions = (requestOptions: RequestOptions) => {
  const defaultOptions = {
    method: "POST",
    url: "https://api.paymongo.com/v1/checkout_sessions",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Basic c2tfdGVzdF9zUXF0c0s0V3JmUXFyYUZtYWN5bld3WGc6",
    },
    data: {
      data: {
        attributes: {
          billing: {
            address: {
              line1: "Lingsat",
              city: "San Fernando",
              state: "La Union",
              postal_code: "2500",
              country: "PH",
            },
            name: "Reannu Emmanuel Lubiano Instrella",
            email: "reannumon123@gmail.com",
            phone: "09763643131",
          },
          send_email_receipt: true,
          show_description: false,
          show_line_items: true,
          cancel_url: "https://google.com",
          line_items: [
            { amount: 2000, currency: "PHP", name: "productName", quantity: 1 },
          ],
          payment_method_types: [
            "card",
            "gcash",
            "paymaya",
            "grab_pay",
            "dob",
            "dob_ubp",
          ],
          success_url: "https://google.com",
        },
      },
    },
  };

  return {
    ...defaultOptions,
    data: {
      data: {
        attributes: {
          ...defaultOptions.data.data.attributes,
          line_items:
            requestOptions.line_items ||
            defaultOptions.data.data.attributes.line_items,
          cancel_url:
            requestOptions.cancel_url ||
            defaultOptions.data.data.attributes.cancel_url,
          success_url:
            requestOptions.success_url ||
            defaultOptions.data.data.attributes.success_url,
        },
      },
    },
  };
};
