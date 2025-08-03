module.exports = {
  bsonType: 'object',
  required: ['eventId', 'userName', 'rsvpStatus', 'timestamp'],
  additionalProperties: false,
  properties: {
    _id: {
      bsonType: 'objectId',
      description: 'Auto-generated ID.',
    },
    eventId: {
      bsonType: 'objectId',
      description: 'Required. Reference to the associated event.',
    },
    userName: {
      bsonType: 'string',
      description: 'Required. Name of the user RSVPing.',
      minLength: 1,
    },
    rsvpStatus: {
      bsonType: 'string',
      enum: ['attending', 'maybe', 'not attending'],
      description: 'Required. RSVP status.',
    },
    timestamp: {
      bsonType: 'date',
      description: 'Required. When the RSVP was made.',
    },
  },
};
