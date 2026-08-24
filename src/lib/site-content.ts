import type { ContactDetails, HomePageContent, OfferPlan, SiteContent } from '@/types/site-content';

const DATA_DIRECTORY = '/data';

let offerPlansRequest: Promise<OfferPlan[]> | null = null;
let siteContentRequest: Promise<SiteContent> | null = null;

type RawContactData = {
  phone: string,
  email: string,
  aboutUs: string,
  ourOffer: string,
  chessText: string,
  mathText: string,
};

const fallbackContactData: RawContactData = {
  phone: '784 743 346',
  email: 'kontakt@mistrzowielogiki.pl',
  aboutUs: 'Od 2020 roku pomagamy dzieciom i młodzieży rozwijać logiczne myślenie, koncentrację i samodzielność podczas zajęć z matematyki i szachów.',
  ourOffer: 'Uczymy krok po kroku, w spokojnym tempie i z uwagą dopasowaną do aktualnych potrzeb ucznia.',
  chessText: 'Poznaj zajęcia szachowe',
  mathText: 'Poznaj zajęcia z matematyki',
};

async function fetchJson<T>(fileName: string): Promise<T> {
  const response = await fetch(`${DATA_DIRECTORY}/${fileName}`);

  if (!response.ok) {
    throw new Error(`Cannot load ${fileName}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function ensureArray<T>(value: unknown, fileName: string): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  console.error(`Data from ${fileName} is not an array.`);
  return [];
}

function mapHomePageContent(contactData: RawContactData): HomePageContent {
  return {
    aboutUs: contactData.aboutUs,
    ourOffer: contactData.ourOffer,
    chessText: contactData.chessText,
    mathText: contactData.mathText,
    chessPath: 'szachy',
    mathPath: 'matematyka',
    pageTitle: 'O nas',
    aboutTitle: 'Logiczne myślenie to nasza supermoc.',
    offerTitle: 'Dlaczego matematyka i szachy?',
  };
}

function mapContactDetails(contactData: RawContactData): ContactDetails {
  return {
    phoneNumber: contactData.phone,
    email: contactData.email,
  };
}

function createSiteContent(offerPlans: OfferPlan[], contactData: RawContactData): SiteContent {
  return {
    navigationItems: [],
    contactDetails: mapContactDetails(contactData),
    homePage: mapHomePageContent(contactData),
    offerPlans,
    faqSections: [],
    documentResources: [],
    teamMembers: [],
  };
}

export function getFallbackSiteContent(): SiteContent {
  return createSiteContent([], fallbackContactData);
}

export function loadOfferPlans(): Promise<OfferPlan[]> {
  offerPlansRequest ??= (async () => {
    try {
      const rawOfferPlans = await fetchJson<unknown>('oferta.json');
      const offerPlans = ensureArray<OfferPlan>(rawOfferPlans, 'oferta.json');

      if (offerPlans.length > 0) {
        return offerPlans;
      }

      throw new Error('oferta.json does not contain any pricing plans.');
    } catch (error) {
      console.error('Could not load oferta.json. Built-in pricing data will be used.', error);
      return (await import('@/lib/offer-localization')).getFallbackOfferPlans();
    }
  })();

  return offerPlansRequest;
}

export function loadSiteContent(): Promise<SiteContent> {
  siteContentRequest ??= (async () => {
    try {
      const rawContactData = await fetchJson<RawContactData>('dane.json');
      return createSiteContent([], rawContactData);
    } catch (error) {
      console.error('Could not load dane.json. Built-in contact details will be used.', error);
      return createSiteContent([], fallbackContactData);
    }
  })();

  return siteContentRequest;
}
