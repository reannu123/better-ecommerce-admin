import axios from "axios";
interface RequestOptions {
  line_items?: LineItem[];
  cancel_url?: string;
  success_url?: string;
  reference_number: string;
}

export interface Address {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string | null;
  postal_code?: string;
  state?: string;
}

export interface Billing {
  address: Address;
  email: string;
  name: string;
  phone: string;
}

export interface LineItem {
  name: string;
  quantity: number;
  amount: number;
  currency: string;
  description?: string | null;
  images: string[];
}

interface Payment {
  id: string;
  type: string;
  attributes: {
    access_url: string | null;
    amount: number;
    balance_transaction_id: string;
    billing: Billing;
    currency: string;
    description: string | null;
    disputed: boolean;
    external_reference_number: string | null;
    fee: number;
    instant_settlement: string | null;
    livemode: boolean;
    net_amount: number;
    origin: string;
    payment_intent_id: string;
    payout: string | null;
    source: {
      id: string;
      type: string;
    };
    statement_descriptor: string;
    status: string;
    tax_amount: number | null;
    metadata: any | null; // Replace 'any' with the actual type if known
    refunds: any[]; // Replace 'any' with the actual type if known
    taxes: any[]; // Replace 'any' with the actual type if known
    available_at: number;
    created_at: number;
    credited_at: number;
    paid_at: number;
    updated_at: number;
  };
}

interface PaymentMethodOption {
  card: {
    request_three_d_secure: string;
  };
}

interface PaymentIntent {
  id: string;
  type: string;
  attributes: {
    amount: number;
    capture_type: string;
    client_key: string;
    currency: string;
    description: string | null;
    livemode: boolean;
    statement_descriptor: string;
    status: string;
    last_payment_error: any | null; // Replace 'any' with the actual type if known
    payment_method_allowed: string[];
    payments: Payment[];
    next_action: any | null; // Replace 'any' with the actual type if known
    payment_method_options: PaymentMethodOption;
    metadata: any | null; // Replace 'any' with the actual type if known
    setup_future_usage: any | null; // Replace 'any' with the actual type if known
    created_at: number;
    updated_at: number;
  };
}

interface CheckoutSession {
  id: string;
  type: string;
  attributes: {
    billing: Billing;
    billing_information_fields_editable: string;
    cancel_url: string;
    checkout_url: string;
    client_key: string;
    customer_email: string | null;
    description: string | null;
    line_items: LineItem[];
    livemode: boolean;
    merchant: string;
    origin: string | null;
    paid_at: number;
    payments: Payment[];
    payment_intent: PaymentIntent;
    payment_method_types: string[];
    payment_method_used: string;
    reference_number: string | undefined;
    send_email_receipt: boolean;
    show_description: boolean;
    show_line_items: boolean;
    status: string;
    success_url: string;
    created_at: number;
    updated_at: number;
    metadata: any | null; // Replace 'any' with the actual type if known
  };
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
  const encodedCredentials = Buffer.from(
    `${process.env.PAYMONGO_SECRET_KEY}:`
  ).toString("base64");
  const defaultOptions = {
    method: "POST",
    url: "https://api.paymongo.com/v1/checkout_sessions",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Basic ${encodedCredentials}`,
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
          reference_number: "0",
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
          reference_number: requestOptions.reference_number,
        },
      },
    },
  };
};

interface WebhookData {
  id: string;
  type: string;
  attributes: {
    type: string;
    livemode: boolean;
    data: CheckoutSession;
    previous_data: any;
    created_at: number;
    updated_at: number;
  };
}

export const extractWebhookData = async (
  req: Request
): Promise<WebhookData> => {
  const webhook_data = await req.json();
  const data = webhook_data.data;
  return data;
};
