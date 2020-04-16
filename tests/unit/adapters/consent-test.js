import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { authenticateSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import $ from 'jquery';
import { settled } from '@ember/test-helpers';

const TEST_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6ImhleDY0In0.eyJzY29wZSI6WyJ1cm46cGluZ2RpcmVjdG9yeTpjb25zZW50Il0sImNsaWVudF9pZCI6InByaXZhY3ktZGFzaGJvYXJkIiwicGkuc3JpIjoiUUw3dFFZSzF5NElTZmd2bVpxLWFMYndHUlJjLi5jY0lWIiwic3ViIjoiYmMzZWQzMGQtZmIwMS0zMjM1LTk0NTUtOGQ0Y2U2NzcwYzQyIiwiZXhwIjoxNTM0MTg5MTM0fQ.AbbywWNZ_OL0KgaoQK5zOcnCdQfT9fdejtzntf0EZkc";
const TEST_SUBJECT = "bc3ed30d-fb01-3235-9455-8d4ce6770c42";

module('Unit | Adapter | consent', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:consent');
    assert.ok(adapter);
  });

  test('authenticated get requests have subject included in the data', async function(assert) {
    let done = assert.async();
    const adapter = this.owner.lookup('adapter:consent');
    const storeStub = this.spy()
    const ajaxStub = this.stub($, 'ajax').callsFake(function() {
      return { catch: function() {} };
    });

    await authenticateSession({
      authorizationToken: {
        access_token: TEST_ACCESS_TOKEN
      }
    });

    adapter.findAll(storeStub, {type: 'consent'});

    let ajaxOptions = ajaxStub.getCall(0).lastArg;
    assert.equal(ajaxStub.callCount, 1, "should have been called once");
    assert.deepEqual(ajaxOptions.data, {subject: TEST_SUBJECT})

    done();
  });

  test('after a failed request, the session is cleared', async function(assert) {
    let done = assert.async();
    const adapter = this.owner.lookup('adapter:consent');
    const storeStub = this.spy();

    this.server.createList('consent', 5)

    adapter.urlForFindAll = () => 'http://example.com/consent/v1/consents';

    this.server.get('http://example.com/consent/v1/consents', {message: 'unauthorized'}, 400);

    const invalidateStub = this.spy(adapter.session, 'invalidate');

    await authenticateSession({
      authorizationToken: {
        access_token: TEST_ACCESS_TOKEN
      }
    });

    await adapter.findAll(storeStub, {type: 'consent'}).catch(() => { /* silence the error in the test */ });

    await settled();
    done();

    assert.deepEqual(invalidateStub.callCount, 1, "invalidate session should have been called");
  });

  test('if session is authenticated, bearer token is included in request header', async function(assert) {
    let done = assert.async();
    const adapter = this.owner.lookup('adapter:consent');
    adapter.urlForFindAll = () => 'http://example.com/consent/v1/consents';
    const storeStub = this.spy();

    this.server.get('http://example.com/consent/v1/consents', function(db, request) {
      assert.equal(request.requestHeaders['Authorization'], `Bearer ${TEST_ACCESS_TOKEN}`);
      return {};
    });

    await authenticateSession({
      authorizationToken: {
        access_token: TEST_ACCESS_TOKEN
      }
    });

    await adapter.findAll(storeStub, {type: 'consent'});
    done();
  })

});
