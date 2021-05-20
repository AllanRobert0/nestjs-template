import { AdvertisementEntity } from '../../entities/advertisement.entity';

export class UserDataDto {
  id: string;
  email: string;
  name: string;
  telephone: string;
  advertisements: AdvertisementEntity[];
}
