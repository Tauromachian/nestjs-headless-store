import { ValidationError } from '@nestjs/common';

export function formatErrorMessages(errors: ValidationError[]) {
  if (errors.length === 1) {
    return errors[0].toString();
  }

  const errorMessages = [];
  for (const error of errors) {
    errorMessages.push(error.toString());
  }

  return errorMessages;
}
