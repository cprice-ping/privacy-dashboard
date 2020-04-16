import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  dataText   : () => faker.lorem.sentences(1),
  purposeText: () => faker.lorem.sentences(2),
  createdDate: faker.date.past(),
  updatedDate() {
    return this.createdDate;
  }
});
