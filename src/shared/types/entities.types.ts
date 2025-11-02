export interface IIdentifiable {
  id: number;
}

export interface INameable {
  name: string;
}

export interface ICreatable {
  createdAt: Date;
}

export interface IUpdatable {
  updatedAt: Date;
}

export interface IExpirable {
  expiresAt: Date;
}

export interface IValuable<T> {
  value: T;
}
