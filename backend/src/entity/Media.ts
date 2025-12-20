import { EntitySchema } from 'typeorm';
import { IMedia } from '../types';

const Media = new EntitySchema<IMedia>({
  name: 'Media',
  tableName: 'media',
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
    file_name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    file_size: {
      type: 'int',
      nullable: true,
    },
    display_order: {
      type: 'int',
      default: 0,
    },
    mime_type: {
      type: 'enum',
      enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4'],
      nullable: true,
    },
    media_type: {
      type: 'enum',
      enum: ['image', 'video', 'document', 'thumbnail'],
      default: 'image',
    },
    uploaded_at: {
      type: 'timestamp',
      nullable: true,
    },
    deleted_at: {
      type: 'timestamp',
      nullable: true,
      deleteDate: true,
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
      inverseSide: 'media',
      onDelete: 'CASCADE',
    },
  },
});

export default Media;
