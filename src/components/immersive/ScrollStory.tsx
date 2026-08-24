import { cn } from '@/lib/utils';
import { navigateToStorySection } from '@/lib/section-navigation';
import { ArrowDown } from 'lucide-react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type StoryNavigationItem = {
  id: string,
  label: string,
};

type ScrollStoryProps = {
  ariaLabel: string,
  children: ReactNode,
  items: StoryNavigationItem[],
};

type RevealProps = {
  children: ReactNode,
  className?: string,
  delay?: number,
};

type StorySectionProps = {
  children: ReactNode,
  className?: string,
  deferIntrinsicSize?: string,
  deferRendering?: boolean,
  id: string,
};

type StorySectionMetric = {
  bottom: number,
  element: HTMLElement,
  id: string,
  top: number,
};

const revealCallbacks = new WeakMap<Element, () => void>();
let sharedRevealObserver: IntersectionObserver | null = null;

function getRevealObserver(): IntersectionObserver {
  if (!sharedRevealObserver) {
    sharedRevealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealCallbacks.get(entry.target)?.();
          revealCallbacks.delete(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );
  }

  return sharedRevealObserver;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('is-visible');
      return;
    }

    const observer = getRevealObserver();
    revealCallbacks.set(element, () => element.classList.add('is-visible'));

    observer.observe(element);
    return () => {
      revealCallbacks.delete(element);
      observer.unobserve(element);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn('story-reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

export function StorySection({
  children,
  className,
  deferIntrinsicSize,
  deferRendering = false,
  id,
}: StorySectionProps) {
  return (
    <section
      id={id}
      data-story-section
      className={cn('story-section', deferRendering && 'story-section-deferred', className)}
      style={deferIntrinsicSize
        ? { '--story-intrinsic-size': deferIntrinsicSize } as CSSProperties
        : undefined}>
      {children}
    </section>
  );
}

export function ScrollCue({ label }: { label: string }) {
  return (
    <button
      type='button'
      className='story-scroll-cue min-h-11 rounded-full px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4'
      onClick={(event) => {
        const currentSection = event.currentTarget.closest<HTMLElement>('[data-story-section]');
        const nextSection = currentSection?.nextElementSibling;

        if (nextSection instanceof HTMLElement && nextSection.matches('[data-story-section]')) {
          navigateToStorySection(nextSection.id);
        }
      }}>
      <span>
        {label}
      </span>
      <ArrowDown className='h-4 w-4' />
    </button>
  );
}

export function ScrollStory({ ariaLabel, children, items }: ScrollStoryProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [isStoryVisible, setIsStoryVisible] = useState(true);
  const [isRailFocused, setIsRailFocused] = useState(false);
  const activeIdRef = useRef(activeId);
  const isStoryVisibleRef = useRef(isStoryVisible);
  const storyShellRef = useRef<HTMLDivElement>(null);
  const desktopProgressRef = useRef<HTMLSpanElement>(null);
  const mobileProgressRef = useRef<HTMLSpanElement>(null);
  const sectionIdsKey = items.map(({ id }) => id).join('\u001f');

  useEffect(() => {
    let animationFrameId: number | null = null;
    let resizeTimeoutId: number | null = null;
    let wheelLockUntil = 0;
    let isMeasurementPending = true;
    let lastProgress = -1;
    let sectionMetrics: StorySectionMetric[] = [];
    let viewportHeight = window.innerHeight;

    const sectionElements = sectionIdsKey
      .split('\u001f')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const footerElement = document.querySelector<HTMLElement>('[data-story-footer]');
    const scrollElements = footerElement ? [...sectionElements, footerElement] : sectionElements;

    document.documentElement.classList.add('story-scroll-snap');

    const fitSectionContents = () => {
      sectionElements.forEach((section) => {
        const content = section.querySelector<HTMLElement>(':scope > .container');

        if (!content) {
          section.style.removeProperty('--story-fit-scale');
          return;
        }

        // Transforms do not affect these layout measurements, so repeated fitting
        // stays stable while accordions, filters, fonts, and the viewport change.
        const sectionStyle = window.getComputedStyle(section);
        const verticalPadding = Number.parseFloat(sectionStyle.paddingTop)
          + Number.parseFloat(sectionStyle.paddingBottom);
        const availableHeight = Math.max(section.clientHeight - verticalPadding, 1);
        const availableWidth = Math.max(section.clientWidth, 1);
        const contentHeight = Math.max(content.scrollHeight, content.offsetHeight, 1);
        const contentWidth = Math.max(content.scrollWidth, content.offsetWidth, 1);
        const nextScale = Math.min(1, availableHeight / contentHeight, availableWidth / contentWidth);

        section.style.setProperty('--story-fit-scale', nextScale.toFixed(4));
      });
    };

    const getFocusedSectionIndex = () => {
      const focusLine = window.innerHeight * 0.46;
      const visibleIndex = scrollElements.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= focusLine && rect.bottom >= focusLine;
      });

      if (visibleIndex >= 0) {
        return visibleIndex;
      }

      const activeIndex = scrollElements.findIndex(({ id }) => id === activeIdRef.current);
      if (activeIndex >= 0) {
        return activeIndex;
      }

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      scrollElements.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = rect.top <= focusLine && rect.bottom >= focusLine
          ? 0
          : Math.min(Math.abs(rect.top - focusLine), Math.abs(rect.bottom - focusLine));

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 8) {
        return;
      }

      const now = window.performance.now();
      if (now < wheelLockUntil) {
        event.preventDefault();
        return;
      }

      const currentIndex = getFocusedSectionIndex();
      const currentSection = scrollElements[currentIndex];
      if (!currentSection) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      if (currentSection.classList.contains('story-section-scrollable')) {
        const currentRect = currentSection.getBoundingClientRect();
        const canContinueInsideSection = direction > 0
          ? currentRect.bottom > viewportHeight + 1
          : currentRect.top < 63;

        if (canContinueInsideSection) {
          return;
        }
      }

      const nextSection = scrollElements[currentIndex + direction];
      if (!nextSection) {
        return;
      }

      event.preventDefault();
      wheelLockUntil = now + (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 720);
      navigateToStorySection(nextSection.id);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.altKey
        || event.ctrlKey
        || event.metaKey
        || target instanceof HTMLInputElement
        || target instanceof HTMLSelectElement
        || target instanceof HTMLTextAreaElement
        || (target instanceof HTMLElement && (target.isContentEditable || target.closest('button, a')))
      ) {
        return;
      }

      const direction = event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)
        ? 1
        : event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)
          ? -1
          : 0;

      if (direction === 0) {
        return;
      }

      const currentIndex = getFocusedSectionIndex();
      if (!scrollElements[currentIndex]) {
        return;
      }

      const nextSection = scrollElements[currentIndex + direction];
      if (!nextSection) {
        return;
      }

      event.preventDefault();
      const now = window.performance.now();
      if (now < wheelLockUntil) {
        return;
      }

      wheelLockUntil = now + (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 720);
      navigateToStorySection(nextSection.id);
    };

    const measureSections = () => {
      const scrollOffset = window.scrollY;

      fitSectionContents();
      viewportHeight = window.innerHeight;
      sectionMetrics = sectionElements.map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          bottom: rect.bottom + scrollOffset,
          element,
          id: element.id,
          top: rect.top + scrollOffset,
        };
      });
      isMeasurementPending = false;
    };

    const setActiveSection = (nextActiveId: string) => {
      if (activeIdRef.current !== nextActiveId) {
        activeIdRef.current = nextActiveId;
        setActiveId(nextActiveId);
      }
    };

    const setStoryVisibility = (nextIsVisible: boolean) => {
      if (isStoryVisibleRef.current !== nextIsVisible) {
        isStoryVisibleRef.current = nextIsVisible;
        setIsStoryVisible(nextIsVisible);
      }
    };

    const updateProgressIndicators = (nextProgress: number) => {
      const roundedProgress = Math.round(nextProgress * 1000) / 1000;

      if (roundedProgress === lastProgress) {
        return;
      }

      lastProgress = roundedProgress;

      if (desktopProgressRef.current) {
        desktopProgressRef.current.style.transform = `scaleY(${Math.max(roundedProgress, 0.03)})`;
      }

      if (mobileProgressRef.current) {
        mobileProgressRef.current.style.transform = `scaleX(${Math.max(roundedProgress, 0.04)})`;
      }
    };

    const updateScrollState = () => {
      if (isMeasurementPending) {
        measureSections();
      }

      if (sectionMetrics.length === 0) {
        return;
      }

      const scrollOffset = window.scrollY;
      const firstTop = sectionMetrics[0].top;
      const lastBottom = sectionMetrics[sectionMetrics.length - 1].bottom;
      const footerBottom = footerElement
        ? footerElement.getBoundingClientRect().bottom + scrollOffset
        : lastBottom;
      const viewportBottom = scrollOffset + viewportHeight;
      const storyVisibilityLine = scrollOffset + viewportHeight * 0.6;
      const isWithinStory = viewportBottom > firstTop && storyVisibilityLine <= footerBottom;

      setStoryVisibility(isWithinStory);

      if (!isWithinStory) {
        return;
      }

      const focusLine = scrollOffset + viewportHeight * 0.46;
      let closestSection = sectionMetrics[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionMetrics.forEach((section) => {
        const distance = section.top <= focusLine && section.bottom >= focusLine
          ? 0
          : Math.min(Math.abs(section.top - focusLine), Math.abs(section.bottom - focusLine));

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      });

      setActiveSection(closestSection.id);

      const travel = Math.max(lastBottom - firstTop - viewportHeight, 1);
      const nextProgress = Math.min(Math.max((scrollOffset - firstTop) / travel, 0), 1);

      updateProgressIndicators(nextProgress);
    };

    const runScrollUpdate = () => {
      animationFrameId = null;
      updateScrollState();
    };

    const requestScrollUpdate = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(runScrollUpdate);
      }
    };

    const requestMeasurementUpdate = () => {
      isMeasurementPending = true;
      requestScrollUpdate();
    };

    const requestViewportMeasurementUpdate = () => {
      if (resizeTimeoutId !== null) {
        window.clearTimeout(resizeTimeoutId);
      }

      resizeTimeoutId = window.setTimeout(() => {
        resizeTimeoutId = null;
        requestMeasurementUpdate();
      }, 120);
    };

    updateScrollState();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestViewportMeasurementUpdate);
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    const resizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(requestMeasurementUpdate)
      : null;

    if (storyShellRef.current) {
      resizeObserver?.observe(storyShellRef.current);
    }

    sectionElements.forEach((section) => {
      const content = section.querySelector<HTMLElement>(':scope > .container');
      if (content) {
        resizeObserver?.observe(content);
      }
    });

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (resizeTimeoutId !== null) {
        window.clearTimeout(resizeTimeoutId);
      }

      window.removeEventListener('scroll', requestScrollUpdate);
      window.removeEventListener('resize', requestViewportMeasurementUpdate);
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.documentElement.classList.remove('story-scroll-snap');
      resizeObserver?.disconnect();
    };
  }, [sectionIdsKey]);

  const scrollToSection = useCallback((id: string) => {
    navigateToStorySection(id);
  }, []);

  const handleSectionLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  }, [scrollToSection]);

  const activeIndex = Math.max(items.findIndex(({ id }) => id === activeId), 0);

  return (
    <div ref={storyShellRef} className='story-shell'>
      <nav
        className='story-progress-rail'
        aria-label={ariaLabel}
        hidden={!isStoryVisible && !isRailFocused}
        onFocusCapture={() => setIsRailFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsRailFocused(false);
          }
        }}>
        <div className='story-progress-track' aria-hidden='true'>
          <span
            ref={desktopProgressRef}
            style={{ height: '100%', transform: 'scaleY(0.03)', transformOrigin: 'top center' }}>
          </span>
        </div>
        <div className='story-progress-items'>
          {items.map((item, index) => {
            const isActive = item.id === activeId;
            const isPast = index < activeIndex;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'step' : undefined}
                className={cn('story-progress-item', isActive && 'is-active', isPast && 'is-past')}
                onClick={(event) => handleSectionLinkClick(event, item.id)}>
                <span className='story-progress-dot'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className='story-progress-label'>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      <div className='story-progress-mobile' hidden={!isStoryVisible}>
        <span className='story-progress-mobile-count'>
          {String(activeIndex + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
        </span>
        <label className='story-progress-mobile-label'>
          <span className='sr-only'>{ariaLabel}</span>
          <select
            aria-label={ariaLabel}
            value={items[activeIndex]?.id ?? ''}
            onChange={(event) => scrollToSection(event.target.value)}>
            {items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <span className='story-progress-mobile-line' aria-hidden='true'>
          <span
            ref={mobileProgressRef}
            style={{ transform: 'scaleX(0.04)', transformOrigin: 'left center', width: '100%' }}>
          </span>
        </span>
      </div>

      {children}
    </div>
  );
}
