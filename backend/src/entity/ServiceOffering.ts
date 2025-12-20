import { EntitySchema } from 'typeorm';
import { IServiceOffering } from '../types';

const ServiceOffering = new EntitySchema<IServiceOffering>({
  name: 'ServiceOffering',
  tableName: 'service_offerings',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    specialists: {
      type: 'uuid',
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    specialist: {
      type: 'many-to-one',
      target: 'Specialist',
      joinColumn: {
        name: 'specialists',
        referencedColumnName: 'id',
      },
      inverseSide: 'serviceOfferings',
      onDelete: 'CASCADE',
    },
  },
});

export default ServiceOffering;
