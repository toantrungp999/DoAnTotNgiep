import { isPhoneNumber, isEmail, isValidDate } from "./ArrayEx";

function validation(value, rules) {
  var valid = true;
  var message = "";
  rules.map((rule) => {
    const key = Object.keys(rule)[0];
    switch (key) {
      case "require":
        if (value.toString().trim() === "") valid = false;
        break;
      case "min":
        if (value.toString().trim().length < rule.min) valid = false;
        break;
      case "max":
        if (value.toString().trim().length > rule.max) valid = false;
        break;
      case "phoneNumber":
        if (!isPhoneNumber(value.trim())) valid = false;
        break;
      case "date":
        if (!isValidDate(value)) valid = false;
        break;
      case "email":
        if (!isEmail(value.trim())) valid = false;
        break;
      case "equal":
        if (value.toString().trim() !== rule.equal.toString().trim())
          valid = false;
        break;
      case "biggerDate":
        if (
          rule.biggerDate &&
          Date.parse(new Date(value)) <= Date.parse(new Date(rule.biggerDate))
        )
          valid = false;
        break;
      default:
        break;
    }
    if (!valid) {
      message = message === "" ? rule.message : message;
    }
    return null;
  });
  return { valid, message };
}

export { validation };
