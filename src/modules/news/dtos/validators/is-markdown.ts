import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { marked } from 'marked';

@ValidatorConstraint({ name: 'IsMarkdownConstraint', async: false })
export class IsMarkdownConstraint implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    marked.setOptions({
      gfm: true,
      breaks: false,
    });

    marked.parse(text);

    return true;
  }

  defaultMessage(): string {
    return 'Invalid markdown text';
  }
}

export const IsMarkdown = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMarkdownConstraint,
    });
  };
};
