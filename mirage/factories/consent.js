import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  // id: () => faker.random.uuid(),
  status: () => faker.random.arrayElement(["denied", "pending", "accepted"]),
  subject: () => faker.random.uuid(),
  actor() {
    return this.subject;
  },
  audience: "consent-demo",
  // definition ()  {
  //   return {
  //     "id": `${faker.lorem.words(2).underscore()}`,
  //     "version": "1.0",
  //     "currentVersion": "1.0",
  //     "locale": "en-US"
  //   };
  // },
  context    : () => {
    return {
      ip: faker.internet.ip(),
      browser: "Google Chrome 64.2"
    }
  },
  dataText   : () => faker.lorem.sentences(1),
  purposeText: () => faker.lorem.sentences(2),
  createdDate: faker.date.past(),
  updatedDate() {
    return this.createdDate;
  }
});
