export interface IFoo {
  id?: number;
  code?: string | null;
  value?: number | null;
}

export class Foo implements IFoo {
  constructor(public id?: number, public code?: string | null, public value?: number | null) {}
}

export function getFooIdentifier(foo: IFoo): number | undefined {
  return foo.id;
}
