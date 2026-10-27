export type Subject =
  | 'Biology'
  | 'Chemistry'
  | 'Physics'
  | 'Mathematics'
  | 'Agriculture'
  | 'Engineering'
  | 'Interdisciplinary';

export type LearnerLevel =
  | 'Primary / Elementary (KS2)'
  | 'Lower Secondary (JHS / KS3)'
  | 'Upper Secondary (SHS / KS4&5)'
  | 'Tertiary (University & College)';

export type PublicationStatus = 'draft' | 'published';

export type SimulationType =
  | 'optics'
  | 'soil_agriculture'
  | 'beam_engineering'
  | 'photosynthesis'
  | 'geometry'
  | 'kinetics_chemistry'
  | 'calculus_math';

export interface InteractiveSimulationConfig {
  enabled: boolean;
  type: SimulationType;
  title: string;
  subtitle?: string;
  description: string;
  param1Label: string;
  param1Default: number;
  param1Min: number;
  param1Max: number;
  param1Unit: string;
  param2Label?: string;
  param2Default?: number;
  param2Min?: number;
  param2Max?: number;
  param2Unit?: string;
  principleNote: string;
}

export interface KnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface WorkedExample {
  title: string;
  problem: string;
  solution: string;
  keyInsight: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LearningResource {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  subject: Subject;
  category: string;
  tags: string[];
  learner_level: LearnerLevel;
  featured_image: string;
  reading_time_minutes: number;
  video_url?: string;
  author: string;
  status: PublicationStatus;
  meta_title?: string;
  meta_description?: string;
  learning_objectives: string[];
  worked_examples: WorkedExample[];
  knowledge_checks: KnowledgeCheck[];
  faqs: FAQItem[];
  simulation?: InteractiveSimulationConfig;
  created_at: string;
  updated_at: string;
}

export interface PodcastEpisode {
  id: string;
  episode_number: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  guest_name?: string;
  guest_role?: string;
  audio_url: string;
  video_url?: string;
  cover_image: string;
  duration_minutes: number;
  transcript?: string;
  tags: string[];
  status: PublicationStatus;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  full_story: string;
  location?: string;
  featured_image: string;
  video_url?: string;
  gallery_images: string[];
  project_date?: string;
  outcomes: { metric: string; label: string }[];
  partner_names: string[];
  status: PublicationStatus;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'unread' | 'replied' | 'archived';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  consent_given: boolean;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
}

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  initiative: string;
  skills: string;
  availability?: string;
  created_at: string;
}
