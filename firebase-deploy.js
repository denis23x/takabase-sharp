const prompts = require('prompts');
const spawn = require('child_process').spawn;

(async () => {
  const select = await prompts({
    type: 'select',
    name: 'value',
    message: 'Select a environment',
    choices: [
      {
        title: 'takabase-dev',
        value: 'takabase-dev',
        description: 'https://takabase-dev-sharp.web.app',
      },
      {
        title: 'takabase-prod',
        value: 'takabase-prod',
        description: 'https://takabase-prod-sharp.web.app',
      },
    ],
    initial: 0
  });

  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Can you confirm?',
    initial: select.value === 'takabase-dev'
  });

  if (select.value && confirm.value) {
    const command = `firebase use ${select.value} && firebase deploy --only functions:sharp,hosting:${select.value}-sharp`;

    /** RUN */

    spawn(command, {
      shell: true,
      stdio:'inherit'
    });
  } else {
    console.log('Ok, Bye!');
  }
})();
