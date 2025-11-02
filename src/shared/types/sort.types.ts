export interface ISort<T> {
  sortBy: keyof T;
  descending?: boolean;
}
