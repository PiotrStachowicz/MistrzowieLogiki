import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { notFoundMetadata, pageMetadata, type PageMetadata } from './src/lib/page-metadata';
import type { Language } from './src/lib/i18n';

type StaticRouteMetadata = PageMetadata & {
  basePath: string,
  language: Language,
  outputPath: string,
};

const staticRoutes: StaticRouteMetadata[] = Object.entries(pageMetadata).flatMap(([basePath, localizedMetadata]) => (
  (['pl', 'en'] as const).map((language) => ({
    ...localizedMetadata[language],
    basePath,
    language,
    outputPath: language === 'en'
      ? `/en${basePath === '/' ? '' : basePath}`
      : basePath,
  }))
));

const heroImagesByRoute: Record<string, string> = {
  '/': 'home-hero',
  '/szachy': 'story-chess-hero',
  '/matematyka': 'math-hero',
  '/cennik': 'pricing-hero',
  '/kontakt': 'contact-hero',
  '/faq': 'faq-hero',
  '/zapisz': 'registration-hero',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderStaticRouteHtml(template: string, metadata: StaticRouteMetadata, siteUrl: string): string {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonicalUrl = `${siteUrl}${metadata.outputPath || '/'}`;
  const polishUrl = `${siteUrl}${metadata.basePath}`;
  const englishUrl = `${siteUrl}/en${metadata.basePath === '/' ? '' : metadata.basePath}`;
  const imageUrl = `${siteUrl}/redesign/home-hero-1536.webp`;
  const heroImageName = heroImagesByRoute[metadata.basePath];
  const heroPreload = heroImageName
    ? `<link rel="preload" as="image" href="/redesign/${heroImageName}-1024.webp" imagesrcset="/redesign/${heroImageName}-640.webp 640w, /redesign/${heroImageName}-1024.webp 1024w, /redesign/${heroImageName === 'home-hero' ? 'home-hero-1536' : heroImageName}.webp 1536w" imagesizes="100vw" fetchpriority="high" />`
    : '';
  const socialMetadata = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="pl" href="${polishUrl}" />`,
    `<link rel="alternate" hreflang="en" href="${englishUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${polishUrl}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    '<meta property="og:image:width" content="1536" />',
    '<meta property="og:image:height" content="864" />',
    `<meta property="og:image:alt" content="${metadata.language === 'pl' ? 'Zajęcia Mistrzów Logiki' : 'Mistrzowie Logiki lessons'}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
  ].join('\n    ');

  return template
    .replace(/<html lang="[^"]+">/, `<html lang="${metadata.language}">`)
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta property="og:locale" content="[^"]+" \/>/, `<meta property="og:locale" content="${metadata.language === 'pl' ? 'pl_PL' : 'en_GB'}" />`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace('</head>', `    ${heroPreload ? `${heroPreload}\n    ` : ''}${socialMetadata}\n  </head>`);
}

function staticRouteHtmlPlugin(siteUrl: string): Plugin {
  let outputDirectory = '';

  return {
    name: 'static-route-html',
    apply: 'build',
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const indexPath = path.join(outputDirectory, 'index.html');
      const template = await readFile(indexPath, 'utf8');

      await Promise.all(staticRoutes.map(async (metadata) => {
        const html = renderStaticRouteHtml(template, metadata, siteUrl);

        if (metadata.outputPath === '/') {
          await writeFile(indexPath, html, 'utf8');
          return;
        }

        const routeDirectory = path.join(outputDirectory, metadata.outputPath.slice(1));
        await mkdir(routeDirectory, { recursive: true });
        await writeFile(path.join(routeDirectory, 'index.html'), html, 'utf8');
      }));

      const notFoundHtml = renderStaticRouteHtml(template, {
        ...notFoundMetadata.pl,
        basePath: '/404',
        language: 'pl',
        outputPath: '/404',
      }, siteUrl).replace('</head>', '    <meta name="robots" content="noindex, follow" />\n  </head>');
      await writeFile(path.join(outputDirectory, '404.html'), notFoundHtml, 'utf8');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || 'https://mistrzowielogiki.pl').replace(/\/$/, '');

  return {
    plugins: [react(), staticRouteHtmlPlugin(siteUrl)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
