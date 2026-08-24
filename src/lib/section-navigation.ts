export function navigateToStorySection(id: string) {
  const section = document.getElementById(id);

  if (!section) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nextHash = `#${encodeURIComponent(id)}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState(window.history.state, '', nextHash);
  }
  const block = section.matches('[data-story-footer]') ? 'end' : 'start';
  section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block });

  const heading = section.querySelector<HTMLElement>('h1, h2, h3');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}
