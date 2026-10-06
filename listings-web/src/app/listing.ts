// поля в camelCase — ровно так, как сервер отдаёт JSON (включая обязательное поле address)
export interface Listing {
  id: number;
  title: string;
  price: number;
  district: string;
  address: string;
  rooms: number;
  createdAt: string;
}
