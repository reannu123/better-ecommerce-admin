import axios from "axios";
// convert to base64
interface RequestOptions {
  line_items?: lineItemsProps[];
  cancel_url?: string;
  success_url?: string;
  reference_number?: string;
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
const webhook = {
  data: {
    id: "evt_YMqJAS2eZ1V1p5wzzqXP4uEC",
    type: "event",
    attributes: {
      type: "checkout_session.payment.paid",
      livemode: true,
      data: {
        id: "cs_CbFCTDfxvMFNjwjVi26Uzhtj",
        type: "checkout_session",
        attributes: {
          billing: {
            address: {
              city: "Taguig",
              country: "PH",
              line1: "address line 1",
              line2: "address line 2",
              postal_code: "1234",
              state: "PH-MNL",
            },
            email: "john.doe@paymongo.com",
            name: "John doe",
            phone: null,
          },
          checkout_url:
            "https://checkout.paymongo.com/cs_CbFCTasdvMFNjwjVi26Uzhtj#fneklwafoifdlsa123f5v1=",
          client_key:
            "cs_CbFCTDfxvMFNjwjVi26Uzhtj_client_YyXPYEejtNMmeZfcg5AAzXQ8",
          description: "The beanie products.",
          line_items: [
            {
              amount: 550,
              currency: "PHP",
              description: "A fresh bag of coffee beanines.",
              images: [
                "https://images.unsplash.com/photo-1612346903007-b5ac8bb135bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
              ],
              name: "Beanines",
              quantity: 100,
            },
            {
              amount: 125000,
              currency: "PHP",
              description: "A locally grown Jasmine Rice.",
              images: [
                "https://images.unsplash.com/photo-1612346903007-b5ac8bb135bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
              ],
              name: "Jasmine Rice 25KG",
              quantity: 1,
            },
          ],
          livemode: true,
          merchant: "Paymongo Test Account",
          payments: [
            {
              id: "pay_gPSJ6SB24SVEa5hH8LrXBtd4",
              type: "payment",
              attributes: {
                access_url: null,
                amount: 180000,
                balance_transaction_id: "bal_txn_ck7GWJfM19q5YFQKFqo17vbu",
                billing: {
                  address: {
                    city: "Taguig",
                    country: "PH",
                    line1: "Address 1",
                    line2: "",
                    postal_code: "1234",
                    state: "Metro Manila",
                  },
                  email: "juan.delacruz@paymongo.com",
                  name: "Customer Name",
                  phone: "",
                },
                currency: "PHP",
                description: "The beanie products.",
                disputed: false,
                external_reference_number: null,
                fee: 9000,
                foreign_fee: 1800,
                livemode: true,
                net_amount: 169393,
                origin: "api",
                payment_intent_id: "pi_aJsHfCD2AmR9V5KBvtkW8XY2",
                payout: null,
                source: {
                  id: "card_7EAQrE19W7ESJZkQdoQiy6gj",
                  type: "card",
                  brand: "mastercard",
                  country: "BJ",
                  last4: "2346",
                },
                statement_descriptor: "Paymongo Test Account",
                status: "paid",
                tax_amount: 193,
                metadata: {
                  customer_number: "42jn1i53",
                  remarks:
                    "Customer cannot receive items during weekends or evening",
                  notes: "Additional packaging. Include free samples",
                },
                refunds: [],
                taxes: [
                  {
                    amount: 193,
                    currency: "PHP",
                    inclusive: true,
                    name: "Withholding Tax",
                    type: "withholding_tax",
                    value: "200_bps",
                  },
                  {
                    amount: 1157,
                    currency: "PHP",
                    inclusive: true,
                    name: "VAT",
                    type: "vat",
                    value: "1200_bps",
                  },
                ],
                available_at: 1671526800,
                created_at: 1671438226,
                credited_at: 1671613200,
                paid_at: 1671438228,
                updated_at: 1671438228,
              },
            },
          ],
          payment_intent: {
            id: "pi_aJsHfCD2AmR9V5KBvtkW8XY2",
            type: "payment_intent",
            attributes: {
              amount: 180000,
              capture_type: "automatic",
              client_key:
                "pi_aJsHfCD2AmR9V5KBvtkW8XY2_client_HBSX2uMBbpapxbPVhsy6zdJz",
              currency: "PHP",
              description: "The beanie products.",
              livemode: true,
              statement_descriptor: "Paymongo Test Account",
              status: "succeeded",
              last_payment_error: null,
              payment_method_allowed: ["card", "gcash"],
              payments: [
                {
                  id: "pay_gPSJ6SB24SVEa5hH8LrXBtd4",
                  type: "payment",
                  attributes: {
                    access_url: null,
                    amount: 180000,
                    balance_transaction_id: "bal_txn_ck7GWJfM19q5YFQKFqo17vbu",
                    billing: {
                      address: {
                        city: "Taguig",
                        country: "PH",
                        line1: "Address 1",
                        line2: "",
                        postal_code: "1234",
                        state: "Metro Manila",
                      },
                      email: "juan.delacruz@paymongo.com",
                      name: "Customer Name",
                      phone: "",
                    },
                    currency: "PHP",
                    description: "The beanie products.",
                    disputed: false,
                    external_reference_number: null,
                    fee: 9000,
                    foreign_fee: 1800,
                    livemode: true,
                    net_amount: 169393,
                    origin: "api",
                    payment_intent_id: "pi_aJsHfCD2AmR9V5KBvtkW8XY2",
                    payout: null,
                    source: {
                      id: "card_7EAQrE19W7ESJZkQdoQiy6gj",
                      type: "card",
                      brand: "mastercard",
                      country: "BJ",
                      last4: "2346",
                    },
                    statement_descriptor: "Paymongo Test Account",
                    status: "paid",
                    tax_amount: 193,
                    metadata: {
                      customer_number: "42jn1i53",
                      remarks:
                        "Customer cannot receive items during weekends or evening",
                      notes: "Additional packaging. Include free samples",
                    },
                    refunds: [],
                    taxes: [
                      {
                        amount: 193,
                        currency: "PHP",
                        inclusive: true,
                        name: "Withholding Tax",
                        type: "withholding_tax",
                        value: "200_bps",
                      },
                      {
                        amount: 1157,
                        currency: "PHP",
                        inclusive: true,
                        name: "VAT",
                        type: "vat",
                        value: "1200_bps",
                      },
                    ],
                    available_at: 1671526800,
                    created_at: 1671438226,
                    credited_at: 1671613200,
                    paid_at: 1671438228,
                    updated_at: 1671438228,
                  },
                },
              ],
              next_action: null,
              payment_method_options: {
                card: {
                  request_three_d_secure: "any",
                  installments: {
                    enabled: true,
                  },
                },
              },
              metadata: {
                remarks:
                  "Customer cannot receive items during weekends or evening",
                customer_number: "42jn1i53",
                notes: "Additional packaging. Include free samples",
              },
              setup_future_usage: null,
              created_at: 1671437933,
              updated_at: 1671438228,
            },
          },
          payment_method_types: ["card", "gcash", "atome"],
          reference_number: "m2m39sj43h5lfFSA1sd",
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          status: "active",
          success_url: "https://google.com",
          created_at: 1671437933,
          updated_at: 1671437933,
          metadata: {
            notes: "Additional packaging. Include free samples",
            customer_number: "42jn1i53",
            remarks: "Customer cannot receive items during weekends or evening",
          },
        },
      },
      previous_data: {},
      created_at: 1674197593,
      updated_at: 1674197593,
    },
  },
};
export const extractWebhookData = async (req: Request) => {
  const webhook_data = await req.json();
  const data = webhook_data.data;
  return data;
};
