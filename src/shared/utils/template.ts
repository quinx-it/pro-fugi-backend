import { template, TemplateExecutor } from 'lodash';

export class Template<T extends object> {
  private readonly templateExecutor: TemplateExecutor;

  constructor(public readonly templateString: string) {
    this.templateExecutor = template(templateString);
  }

  execute(args: T): string {
    return this.templateExecutor(args);
  }
}
