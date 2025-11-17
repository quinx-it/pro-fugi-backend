export interface ICreateNewsArticle {
  title: string;
  description: string;
  contentMarkdown: string;
  imageFileName: string;
  tags: string[];

  publishAt: Date | null;
}

export interface IUpdateNewsArticle {
  title?: string;
  description?: string;
  contentMarkdown?: string;
  imageFileName?: string;
  tags?: string[];

  publishAt?: Date | null;
}

export interface INewsArticle {
  id: number;

  title: string;
  description: string;
  contentMarkdown: string;
  imageFileName: string;

  tags: string[];

  createdAt: Date;
  updatedAt: Date;
  publishAt: Date | null;
}
