import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Server entry used ONLY at build time to prerender static HTML (SSG).
 * No Node server is deployed — output is static files for Vercel.
 * The BootstrapContext carries the server platform (NG0401 without it).
 */
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
