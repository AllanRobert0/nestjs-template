import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { genSalt, hash } from 'bcryptjs';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    const salt = await genSalt(12);
    const hashPassword = await hash(event.entity.password, salt);
    event.entity.password = hashPassword;
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>) {
    if (event.databaseEntity.password !== event.entity.password) {
      const salt = await genSalt(12);
      const hashPassword = await hash(event.entity.password, salt);
      event.entity.password = hashPassword;
    }
  }
}
