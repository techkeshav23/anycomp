import { EntitySchema } from 'typeorm';
import { IServiceOfferingsMasterList } from '../types';

const ServiceOfferingsMasterList = new EntitySchema<IServiceOfferingsMasterList>({
  name: 'ServiceOfferingsMasterList',
  tableName: 'service_offerings_master_list',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    s3_key: {
      type: 'varchar',
      length: 500,
      nullable: true,
    },
    bucket_name: {
      type: 'varchar',
      length: 255,
      nullable: true,
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
  indices: [
    {
      name: 'idx_service_id',
      columns: ['id'],
    },
  ],
});

export default ServiceOfferingsMasterList;
