import os from 'os';
import sinon from 'sinon';
import test from 'ava';
import { actions } from './index';

const diagnostics = actions[0].handler;
const sandbox = sinon.createSandbox();
const mocks = {};

test.beforeEach(() => {
  mocks.hostname = sinon.stub(os, 'hostname').returns('test-hostname');
  mocks.platform = sinon.stub(os, 'platform').returns('test-platform');
  mocks.uptime = sinon.stub(os, 'uptime').returns('1 hour');
  mocks.cpus = sinon.stub(os, 'cpus').returns([
    { model: 'test-model' },
  ]);
  mocks.totalmem = sinon.stub(os, 'totalmem').returns(50);
  mocks.freemem = sinon.stub(os, 'freemem').returns(25);
});

test.afterEach(() => {
  sandbox.restore();
});

test('It returns a string of diagnostics', (t) => {
  const result = diagnostics();

  t.true(result.includes('Hostname: test-hostname'));
  t.true(result.includes('Platform: test-platform'));
  t.true(result.includes('CPU: test-model (x1)'));
  t.true(result.includes('Uptime: 1 hour'));
  t.true(result.includes('Memory: 25/50 (50%)'));
});
