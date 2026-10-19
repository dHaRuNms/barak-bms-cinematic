import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
const root = document.getElementById('root')!;
async function mount() {
  const company = location.pathname.endsWith('company.html');
  const Page = company ? (await import('./CompanyApp')).default : App;
  if (company) await import('./styles.css');
  const app = <StrictMode><Page/></StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
void mount();
