import { ICreatable, IIdentifiable } from '@/shared';

export interface IRabbitMqConfig {
  hostName: string;
  hostPort: number;
  containerPort: number;
  username: string;
  password: string;
}

export interface IRabbitMqEvent<T> extends IIdentifiable, ICreatable {
  body: T;
}

export interface IRabbitMqEventBodyOptions {
  toSnakeCase: boolean;
  flattenRanges: boolean;
}
