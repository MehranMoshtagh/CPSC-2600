module.exports = {
  bsonType: 'object',
  required: ['name', 'date', 'location', 'createdAt'],
  additionalProperties: false,
  properties: {
    _id: {
      bsonType: 'objectId',
      description: 'Auto-generated ID.',
    },
    name: {
      bsonType: 'string',
      description: 'Required. Title of the event.',
      minLength: 1,
    },
    description: {
      bsonType: 'string',
      description: 'Optional. Detailed description of the event.',
    },
    date: {
      bsonType: 'date',
      description: 'Required. When the event takes place.',
    },
    location: {
      bsonType: 'string',
      description: 'Required. Where the event is held.',
      minLength: 1,
    },
    organizer: {
      bsonType: 'string',
      description: 'Optional. Who organized the event.',
    },
    createdAt: {
      bsonType: 'date',
      description: 'Required. Timestamp when the event was created.',
    },
  },
};
