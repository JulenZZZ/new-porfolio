import { Project } from '../models/project';

/**
 * The 4 portfolio projects from the live site (English).
 * Slugs are language-neutral identifiers (one URL per project).
 * Thumbnails reuse the live-site asset paths until re-sourced as AVIF/WebP.
 * Years are unknown on the live site — 2024 (footer year) used as a
 * placeholder. OWNER MUST VERIFY years, roles and extended descriptions.
 */
export const projectsEn: Project[] = [
  {
    slug: 'todo-list-app',
    title: 'To-Do List App',
    tagline: {
      pl: 'Nowoczesna aplikacja do zarządzania codziennymi zadaniami.',
      en: 'Modern to-do web app for tracking everyday tasks.',
    },
    description: {
      pl: 'Nowoczesna aplikacja do zarządzania codziennymi zadaniami, z przejrzystym interfejsem opartym na Material.\n\nZbudowana w Angularze i Angular Material po stronie front-endu, z backendem ASP.NET i bazą SQL Server.',
      en: 'A modern to-do web application for tracking everyday tasks, with a clean Material interface.\n\nBuilt with Angular and Angular Material on the front end, backed by ASP.NET and SQL Server.',
    },
    tech: ['Angular', 'Angular Material', 'ASP.NET', 'SQL Server'],
    year: 2024,
    role: { pl: 'Programista full-stack', en: 'Full-stack developer' },
    thumbnail: 'https://vqdafevef2xzzpen.private.blob.vercel-storage.com/todo.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfdlFkYWZFVmVGMnh6elBFbiIsIm93bmVySWQiOiJ0ZWFtXzZlUDZ5TlZQUUVPWWNtZnI4cGFQbURUYyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkyMTMyNTAwODkzLCJpYXQiOjE3OTIwODkzMDIyMjJ9.5-aCgnnAfy0ePLzgVquWJRAnJz6spY1d3CiSC_DIBTk&vercel-blob-signature=j345pWwzqpOcDLZa5_BIkrKBDEr9EBvCP0qNWmLmZIA',
    thumbnailAlt: {
      pl: 'Zrzut ekranu aplikacji To-Do List',
      en: 'Screenshot of the To-Do List app',
    },
    images: [
      {
        src: 'https://vqdafevef2xzzpen.private.blob.vercel-storage.com/todo.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfdlFkYWZFVmVGMnh6elBFbiIsIm93bmVySWQiOiJ0ZWFtXzZlUDZ5TlZQUUVPWWNtZnI4cGFQbURUYyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkyMTMyNTAwODkzLCJpYXQiOjE3OTIwODkzMDIyMjJ9.5-aCgnnAfy0ePLzgVquWJRAnJz6spY1d3CiSC_DIBTk&vercel-blob-signature=j345pWwzqpOcDLZa5_BIkrKBDEr9EBvCP0qNWmLmZIA',
        alt: {
          pl: 'Zrzut ekranu aplikacji To-Do List',
          en: 'Screenshot of the To-Do List app',
        },
      },
    ],
    links: {},
    featured: true,
  },
  {
    slug: 'choreographer-website',
    title: 'Choreographer Personal Website',
    tagline: {
      pl: 'Elegancka strona promująca usługi choreografa.',
      en: 'Elegant site to promote choreographer services.',
    },
    description: {
      pl: 'Elegancka strona osobista promująca usługi choreografa, z naciskiem na prezentację i czytelność.\n\nZbudowana w Angularze z Tailwind CSS i SCSS po stronie front-endu, z backendem ASP.NET.',
      en: 'An elegant personal website promoting choreographer services, focused on presentation and readability.\n\nBuilt with Angular, Tailwind CSS and SCSS on the front end, backed by ASP.NET.',
    },
    tech: ['Angular', 'Tailwind CSS', 'ASP.NET', 'SCSS'],
    year: 2024,
    role: { pl: 'Programista full-stack', en: 'Full-stack developer' },
    thumbnail: 'https://vqdafevef2xzzpen.private.blob.vercel-storage.com/mena.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfdlFkYWZFVmVGMnh6elBFbiIsIm93bmVySWQiOiJ0ZWFtXzZlUDZ5TlZQUUVPWWNtZnI4cGFQbURUYyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkyMTMyNjIwMzY5LCJpYXQiOjE3OTIwODk0MjE5NzV9.f0rrrBxCoZX1Nz0sGF5Oz55eFtAJ05KIo08YHhptpfA&vercel-blob-signature=oT1Rgm7fEZXQ03dQm2E6C4Q3uH-dWoLfyBQCQFgZSYs',
    thumbnailAlt: {
      pl: 'Zrzut ekranu strony choreografa',
      en: 'Screenshot of the choreographer website',
    },
    images: [
      {
        src: 'https://vqdafevef2xzzpen.private.blob.vercel-storage.com/mena.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfdlFkYWZFVmVGMnh6elBFbiIsIm93bmVySWQiOiJ0ZWFtXzZlUDZ5TlZQUUVPWWNtZnI4cGFQbURUYyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkyMTMyNjIwMzY5LCJpYXQiOjE3OTIwODk0MjE5NzV9.f0rrrBxCoZX1Nz0sGF5Oz55eFtAJ05KIo08YHhptpfA&vercel-blob-signature=oT1Rgm7fEZXQ03dQm2E6C4Q3uH-dWoLfyBQCQFgZSYs',
        alt: {
          pl: 'Zrzut ekranu strony choreografa',
          en: 'Screenshot of the choreographer website',
        },
      },
    ],
    links: {},
    featured: true,
  },
  {
    slug: 'medical-app',
    title: 'Medical Appointment APP',
    tagline: {
      pl: 'Prosty w zarządzaniu aplikacja medyczna.',
      en: 'Simple medical appointment app.',
    },
    description: {
      pl: 'Prosta aplikacja medyczna, łatwa w zarządzaniu.\n\nZbudowana w Angularze, JavaScripcie, HTML i CSS.',
      en: 'A simple medical appointment app that is easy to manage.\n\nBuilt with Angular, JavaScript, HTML and CSS.',
    },
    tech: ['Angular', 'JavaScript', 'HTML', 'CSS'],
    year: 2024,
    role: { pl: 'Programista full-stack', en: 'Full-stack developer' },
    thumbnail: 'https://vqdafevef2xzzpen.private.blob.vercel-storage.com/medical.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfdlFkYWZFVmVGMnh6elBFbiIsIm93bmVySWQiOiJ0ZWFtXzZlUDZ5TlZQUUVPWWNtZnI4cGFQbURUYyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkyMTMzODA4MzI3LCJpYXQiOjE3OTIwOTA2MDk1NTV9.2yHehLUpHn0_KSxVsLOwnzh-pJavFrXOVuMSQF7y3OA&vercel-blob-signature=mjJQZ45wWPjNWXMY0LBlbgRnmo9QDNDMa3fEuBiLlqU',
    thumbnailAlt: {
      pl: 'Zrzut ekranu aplikacji medycznej',
      en: 'Screenshot of the medical app',
    },
    images: [
      {
        src: 'https://vqdafevef2xzzpen.private.blob.vercel-storage.com/medical.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfdlFkYWZFVmVGMnh6elBFbiIsIm93bmVySWQiOiJ0ZWFtXzZlUDZ5TlZQUUVPWWNtZnI4cGFQbURUYyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzkyMTMzODA4MzI3LCJpYXQiOjE3OTIwOTA2MDk1NTV9.2yHehLUpHn0_KSxVsLOwnzh-pJavFrXOVuMSQF7y3OA&vercel-blob-signature=mjJQZ45wWPjNWXMY0LBlbgRnmo9QDNDMa3fEuBiLlqU',
        alt: {
          pl: 'Zrzut ekranu aplikacji medycznej',
          en: 'Screenshot of the medical app',
        },
      },
    ],
    links: {},
    featured: true,
  },
  {
    slug: 'job-portal',
    title: 'Job Portal Site',
    tagline: {
      pl: 'Portal z ofertami pracy zbudowany w Vue, JavaScripcie, CSS i HTML.',
      en: 'Job portal built with Vue, JavaScript, CSS and HTML.',
    },
    description: {
      pl: 'Portal z ofertami pracy umożliwiający przeglądanie ogłoszeń.\n\nZbudowany w Vue, JavaScripcie, HTML i CSS.',
      en: 'A job portal website for browsing job offers.\n\nBuilt with Vue, JavaScript, HTML and CSS.',
    },
    tech: ['Vue', 'JavaScript', 'HTML', 'CSS'],
    year: 2024,
    role: { pl: 'Programista front-end', en: 'Front-end developer' },
    thumbnail: 'assets/img/banner.png',
    thumbnailAlt: {
      pl: 'Zrzut ekranu portalu z ofertami pracy',
      en: 'Screenshot of the job portal site',
    },
    images: [
      {
        src: 'assets/img/banner.png',
        alt: {
          pl: 'Zrzut ekranu portalu z ofertami pracy',
          en: 'Screenshot of the job portal site',
        },
      },
    ],
    links: {},
    featured: false,
  },
];
