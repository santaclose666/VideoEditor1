import {Realm} from '@realm/react';
import {ObjectSchema} from 'realm';
import {generateId} from '../util/uuid';

export class MediaPicker extends Realm.Object<MediaPicker> {
  static schema: ObjectSchema = {
    name: 'MediaPicker',
    properties: {
      id: {type: 'string', default: generateId()},
      uri: 'string',
      minutes: 'string',
      seconds: 'string',
      timeCreated: 'float',
      thumbnail: 'string',
    },
  };
}

export class MediaEdited extends Realm.Object<MediaEdited> {
  static schema: ObjectSchema = {
    name: 'MediaEdited',
    properties: {
      id: {type: 'string', default: generateId()},
      uri: 'string',
      minutes: 'string',
      seconds: 'string',
      timeCreated: 'float',
      thumbnail: 'string',
    },
  };
}
