import Device from './src/models/Device';
import User from './src/models/User';

User.create({
    name: 'Simon Werner',
    userId: 'simonwerner@gmail.com',
    rfidToken: 'DD6F9E29',
    admin: false,
    enabled: true,
    slackUserId: 'U93KS1E8N'
});

Device.create({
    type: 'rfid-reader',
    uid: '600194202C80',
    location: 'hl_door',
    enabled: true
});

Device.create({
    type: 'lock',
    uid: '84f3eb770609',
    location: 'hl_door',
    enabled: true
});
