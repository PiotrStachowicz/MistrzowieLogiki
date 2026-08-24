export type NavigationItem = {
  label: string,
  path: string,
};

export type ContactDetails = {
  phoneNumber: string,
  email: string,
};

export type HomePageContent = {
  aboutUs: string,
  ourOffer: string,
  chessText: string,
  mathText: string,
  chessPath: string,
  mathPath: string,
  pageTitle: string,
  aboutTitle: string,
  offerTitle: string,
};

export type OfferPlan = {
  id: string,
  features: string[],
  icon: string,
  title: string,
  popular?: boolean,
  color?: string,
};

export type FaqQuestion = {
  id: string,
  title: string,
  answer: string,
};

export type FaqSection = {
  title: string,
  questions: FaqQuestion[],
};

export type DocumentResource = {
  name: string,
  href: string,
  isAvailable: boolean,
};

export type TeamMember = {
  imagePath: string,
  name: string,
  description: string,
  moreInfoPath: string,
};

export type RegistrationSelectOption = {
  id: string,
  label: string,
};

export type RegistrationOptions = {
  locations: RegistrationSelectOption[],
  classTypes: RegistrationSelectOption[],
};

export type SiteContent = {
  navigationItems: NavigationItem[],
  contactDetails: ContactDetails,
  homePage: HomePageContent,
  offerPlans: OfferPlan[],
  faqSections: FaqSection[],
  documentResources: DocumentResource[],
  teamMembers: TeamMember[],
};
