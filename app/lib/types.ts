export type Lang = 'id' | 'en';
export type Theme = 'dark' | 'light';
export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed';

export interface I18nString {
  id: string;
  en: string;
}

export interface Settings {
  defaultLang: Lang;
  multiLangEnabled: boolean;
  defaultTheme: Theme;
}

export interface Profile {
  name: string;
  title: I18nString;
  bio: I18nString;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  available: boolean;
  avatar: string;
  yearsExp: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: I18nString;
  tags: string[];
  status: 'completed' | 'in-progress' | 'planning';
  startDate?: string;
  image?: string;
  github: string;
  demo: string;
  featured: boolean;
  year: string;
}

export interface OngoingProject {
  id: string;
  title: string;
  description: I18nString;
  tags: string[];
  status: ProjectStatus;
  startDate: string;
  expectedEnd?: string;
  github?: string;
  demo?: string;
  public: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: I18nString;
  period: string;
  description: I18nString;
}

export interface ContactMsg {
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface Contact {
  headline: I18nString;
  subtext: I18nString;
  messages: ContactMsg[];
}

export interface PortfolioData {
  settings: Settings;
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  ongoingProjects: OngoingProject[];
  experiences: Experience[];
  contact: Contact;
}
