import { execSync } from 'child_process';

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
    execSync(`/usr/local/bin/npx shadcn-ui@latest add ${component}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`Failed to install ${component}:`, error.message);
  }
});
console.log('All components processed.');