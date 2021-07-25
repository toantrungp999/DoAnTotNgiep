const accountSid = "ACc8b21bc31ff559a1842597d7f78cc035";
const authToken = "6d8acb83f829e6e3704119e68537e020";
const messagingServiceSid = "MG5bad914892356a6b82b6b23669146043";
const client = require("twilio")(accountSid, authToken);

module.exports = async function sendSMS(to, body) {
  console.log("[sendSMS] --> Start");

  if (!to.includes("+84")) {
    to = "+84" + to.substring(1);
  }

  await client.messages.create({
    body: body,
    messagingServiceSid,
    to: to,
  });
};
