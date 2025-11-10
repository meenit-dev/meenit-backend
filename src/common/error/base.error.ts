export class BaseError extends Error {
  args: any;
  name: string;

  constructor(args?: any) {
    super();
    this.args = args;
    this.name = this.constructor.name;
  }
}
