export interface ICreatePartnershipLetter {
  text: string;
  phone: string;
}

export interface IUpdatePartnershipLetter {
  isRead: true;
}

export interface IPartnershipLetter {
  id: number;

  text: string;
  phone: string;
  isRead: boolean;

  createdAt: Date;
}
