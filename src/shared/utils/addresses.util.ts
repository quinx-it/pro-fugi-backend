import { IAddress } from '@/shared';

export class AddressesUtil {
  static toPlain(object: IAddress): IAddress {
    return {
      city: object.city,
      street: object.street,
      building: object.building,
      block: object.block,
      apartment: object.apartment,
    };
  }
}
