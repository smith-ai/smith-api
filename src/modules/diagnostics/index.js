import { action, actions } from '@smith-ai/smith-actions';
import os from 'os';

action('run diagnostics', () => {
  const hostname = os.hostname();
  const platform = os.platform();
  const uptime = os.uptime();

  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const cpuCount = cpus.length;

  const totalmem = os.totalmem();
  const freemem = os.freemem();
  const usedmem = totalmem - freemem;
  const mempercent = (usedmem / totalmem * 100).toPrecision(2);

  return [
    `Hostname: ${hostname}`,
    `Platform: ${platform}`,
    `CPU: ${cpuModel} (x${cpuCount})`,
    `Uptime: ${uptime}`,
    `Memory: ${usedmem}/${totalmem} (${mempercent}%)`,
  ].join('\n');
});

export {
  actions,
};
