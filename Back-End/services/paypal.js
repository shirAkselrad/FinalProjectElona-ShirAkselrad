async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || !process.env.PAYPAL_BASE_URL)
    throw new Error("Missing PayPal env variables");
  //creating a string which includes the Client ID and the Client Secret and coding it to 64 base
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        //sending the credentials to PayPal
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      //Requesting an access token using the client credentials
      body: "grant_type=client_credentials",
    },
  );

  if (!response.ok) {
    throw new Error(`PayPal authentication failed: ${response.status}`);
  }

  const data = await response.json();

  //getting the token from paypal
  return data.access_token;
}







module.exports = { getPayPalAccessToken };
