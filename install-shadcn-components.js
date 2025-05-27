const { execSync } = require('child_process');

const components = [
  'button',
  'input',
  'card',
  'form',
  'select',
  'textarea',
  'sonner',
  'toast',
  'table',
  'dialog'
];

components.forEach(component => {
  try {
    console.log(`Installing component: ${component}`);
    execSync(`npx shadcn-ui@latest add ${component}`, {
      stdio: 'inherit',
      cwd: './pets-care-ai-frontend'
    });
  } catch (error) {
    console.error(`Failed to install ${component}:`, error.message);
  }
});
console.log('All components processed.');