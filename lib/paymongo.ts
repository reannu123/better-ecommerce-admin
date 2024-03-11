import axios from "axios";
// convert to base64

export const sendPaymongo = async (options: any) => {
  const response = await axios
    .request(options)
    .then(function (response: any) {
      return response.data;
    })
    .catch(function (error: any) {
      console.error(error);
    });
  return response;
};
