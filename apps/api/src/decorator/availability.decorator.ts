import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { parse } from "date-fns";

export function IsEarlierThan(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    console.log("Registering IsEarlierThan decorator for:", propertyName); // Debugging

    registerDecorator({
      name: "isEarlierThan",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log("Validating IsEarlierThan for:", propertyName); // Debugging

          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // Debugging: Log the input values
          console.log("startTime:", value);
          console.log("endTime:", relatedValue);

          // Parse the time strings into Date objects
          const start = parse(value, "HH:mm", new Date());
          const end = parse(relatedValue, "HH:mm", new Date());

          // Debugging: Log the parsed values
          console.log("Parsed start:", start);
          console.log("Parsed end:", end);

          // Ensure startTime is earlier than endTime
          const isValid = start < end;

          // Debugging: Log the validation result
          console.log("Is valid:", isValid);

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be earlier than ${args.constraints[0]}`;
        },
      },
    });
  };
}
