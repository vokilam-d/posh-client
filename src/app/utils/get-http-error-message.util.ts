import { HttpErrorResponse } from '@angular/common/http';
import { IErrorResponse } from '../interfaces/error-response.interface';

interface ValidationError {
  /**
   * Object that was validated.
   */
  target?: Object;
  /**
   * Object's property that haven't pass validation.
   */
  property: string;
  /**
   * Value that haven't pass a validation.
   */
  value?: any;
  /**
   * Constraints that failed validation with error messages.
   */
  constraints: {
    [type: string]: string;
  };
  /**
   * Contains all nested validation errors of the property.
   */
  children: ValidationError[];
}

export const getHttpErrorMessage = (httpError: HttpErrorResponse): string => {
  let message = '';

  if (httpError.error && httpError.error.message) {
    message += buildErrorMessage(httpError.error);
  } else {
    message += httpError.statusText;
  }

  return message;
}

const buildErrorMessage = (response: IErrorResponse): string => {
  const errors: string[] = [];

  if (typeof response.message === 'string') {
    let strErrorText = ``;
    if (response.error) {
      strErrorText += `${response.error}: `;
    }
    strErrorText += response.message;
    errors.push(strErrorText);

  } else if (Array.isArray(response.message) && (response.message as unknown[]).length > 0) {
    if (response.error) {
      errors.push(response.error + ':');
    }
    errors.push(...getErrorsFromValidationErrors(response.message));
  }

  return errors.join('\n');
}

const getErrorsFromValidationErrors = (validationErrors: ValidationError[]): string[] => {
  const errors: string[] = [];

  validationErrors.forEach(validationError => {

    if (validationError.constraints) {
      let errorMsg = buildMessageFromConstraints(validationError.constraints);

      if (typeof validationError.value === 'string') {
        errorMsg += `, got: '${validationError.value}'`;
      }

      errors.push(errorMsg);
    } else if (typeof validationError === 'string') {
      errors.push(validationError);
    }

    if (Array.isArray(validationError.children) && validationError.children.length > 0) {
      errors.push(...getErrorsFromValidationErrors(validationError.children));
    }
  });

  return errors;
}

const buildMessageFromConstraints = (constraints: ValidationError['constraints']): string => {
  const messages: string[] = [];

  Object.keys(constraints).forEach(key => {
    messages.push(constraints[key]);
  });

  return messages.join(', ');
}
