/**
 * scripts/seed.ts
 * Populates Supabase with mock data for CrismaTest demo:
 *   - 8 test_templates (one per role)
 *   - ~96 questions (6 types × 8 roles × 2 each)
 *   - 40 mock_candidates (~5 per role)
 *
 * Usage: npm run db:seed
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is not set in .env')
  process.exit(1)
}

if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in .env')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

// ============================================================
// Role definitions
// ============================================================
type Role =
  | 'Software Engineer'
  | 'Product Manager'
  | 'Sales Rep'
  | 'Customer Support'
  | 'Marketing Manager'
  | 'Data Analyst'
  | 'UX Designer'
  | 'Operations Manager'

// One color per role (hex), assigned consistently
const ROLE_COLORS: Record<Role, string> = {
  'Software Engineer': '#4F46E5',
  'Product Manager': '#7C3AED',
  'Sales Rep': '#DB2777',
  'Customer Support': '#0891B2',
  'Marketing Manager': '#D97706',
  'Data Analyst': '#059669',
  'UX Designer': '#DC2626',
  'Operations Manager': '#9333EA',
}

// ============================================================
// 8 Test Templates
// ============================================================
const testTemplates = [
  {
    role: 'Software Engineer',
    slug: 'software-engineer',
    name: 'Software Engineer Assessment',
    duration_minutes: 14,
    modules: ['Algorithmic Thinking', 'Code Review', 'System Design', 'Communication'],
    active: true,
  },
  {
    role: 'Product Manager',
    slug: 'product-manager',
    name: 'Product Manager Assessment',
    duration_minutes: 13,
    modules: ['Prioritization', 'User Empathy', 'Roadmapping', 'Stakeholder Communication'],
    active: true,
  },
  {
    role: 'Sales Rep',
    slug: 'sales-rep',
    name: 'Sales Rep Assessment',
    duration_minutes: 10,
    modules: ['Objection Handling', 'Needs Discovery', 'Closing Techniques'],
    active: true,
  },
  {
    role: 'Customer Support',
    slug: 'customer-support',
    name: 'Customer Support Assessment',
    duration_minutes: 11,
    modules: ['Empathy & Tone', 'Problem Resolution', 'Escalation Judgment'],
    active: true,
  },
  {
    role: 'Marketing Manager',
    slug: 'marketing-manager',
    name: 'Marketing Manager Assessment',
    duration_minutes: 12,
    modules: ['Campaign Strategy', 'Data Interpretation', 'Brand Messaging', 'Channel Mix'],
    active: true,
  },
  {
    role: 'Data Analyst',
    slug: 'data-analyst',
    name: 'Data Analyst Assessment',
    duration_minutes: 15,
    modules: ['SQL & Data Querying', 'Statistical Reasoning', 'Data Visualization', 'Insight Communication'],
    active: true,
  },
  {
    role: 'UX Designer',
    slug: 'ux-designer',
    name: 'UX Designer Assessment',
    duration_minutes: 13,
    modules: ['User Research', 'Wireframing Critique', 'Interaction Patterns', 'Accessibility'],
    active: true,
  },
  {
    role: 'Operations Manager',
    slug: 'operations-manager',
    name: 'Operations Manager Assessment',
    duration_minutes: 12,
    modules: ['Process Optimization', 'Risk Management', 'Cross-Team Coordination'],
    active: true,
  },
]

// ============================================================
// ~96 Questions (6 types × 8 roles × 2 each)
// ============================================================
type QuestionType = 'qcm' | 'dragdrop' | 'casestudy' | 'simulation' | 'audiovideo' | 'shorttext'

interface QuestionSeed {
  role: string
  question_type: QuestionType
  text_en: string
  text_fr: string
  options_en?: string[] | null
  options_fr?: string[] | null
  correct_answer?: string | null
}

const questions: QuestionSeed[] = [
  // ── Software Engineer ──────────────────────────────────────
  // qcm
  {
    role: 'Software Engineer',
    question_type: 'qcm',
    text_en: 'Which data structure gives O(1) average-case lookup by key?',
    text_fr: 'Quelle structure de données offre une recherche moyenne en O(1) par clé ?',
    options_en: ['Linked List', 'Hash Map', 'Binary Search Tree', 'Stack'],
    options_fr: ['Liste chaînée', 'Table de hachage', 'Arbre binaire de recherche', 'Pile'],
    correct_answer: 'Hash Map',
  },
  {
    role: 'Software Engineer',
    question_type: 'qcm',
    text_en: 'Which HTTP status code indicates a resource was successfully created?',
    text_fr: 'Quel code HTTP indique qu\'une ressource a été créée avec succès ?',
    options_en: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
    options_fr: ['200 OK', '201 Créé', '204 Pas de contenu', '301 Déplacé définitivement'],
    correct_answer: '201 Created',
  },
  // dragdrop
  {
    role: 'Software Engineer',
    question_type: 'dragdrop',
    text_en: 'Order the SDLC phases from start to finish: Planning, Testing, Coding, Deployment, Requirements.',
    text_fr: 'Classez les phases SDLC du début à la fin : Planification, Tests, Codage, Déploiement, Exigences.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Software Engineer',
    question_type: 'dragdrop',
    text_en: 'Match each Big-O notation to its name: O(1), O(n), O(n²), O(log n).',
    text_fr: 'Associez chaque notation Big-O à son nom : O(1), O(n), O(n²), O(log n).',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'Software Engineer',
    question_type: 'casestudy',
    text_en: 'A production API returns 500 errors on 5% of requests after a recent deploy. What is your debugging approach?',
    text_fr: 'Une API de production renvoie des erreurs 500 sur 5 % des requêtes après un déploiement récent. Quelle est votre approche de débogage ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Software Engineer',
    question_type: 'casestudy',
    text_en: 'You inherit a 10,000-line monolith with no tests. How do you safely refactor it?',
    text_fr: 'Vous héritez d\'un monolithe de 10 000 lignes sans tests. Comment le refactorisez-vous en sécurité ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'Software Engineer',
    question_type: 'simulation',
    text_en: 'Review the following code snippet and identify any bugs or performance issues.',
    text_fr: 'Examinez l\'extrait de code suivant et identifiez les bugs ou problèmes de performance.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Software Engineer',
    question_type: 'simulation',
    text_en: 'Write a SQL query to find the top 5 customers by total order value in the last 30 days.',
    text_fr: 'Rédigez une requête SQL pour trouver les 5 meilleurs clients par valeur totale des commandes au cours des 30 derniers jours.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'Software Engineer',
    question_type: 'audiovideo',
    text_en: 'Record a 2-minute explanation of how you would design a URL shortener service.',
    text_fr: 'Enregistrez une explication de 2 minutes sur la façon dont vous concevriez un service de raccourcissement d\'URL.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Software Engineer',
    question_type: 'audiovideo',
    text_en: 'Describe a time you resolved a critical production incident. What was your role?',
    text_fr: 'Décrivez un moment où vous avez résolu un incident de production critique. Quel était votre rôle ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'Software Engineer',
    question_type: 'shorttext',
    text_en: 'What is the difference between a process and a thread? (2–3 sentences)',
    text_fr: 'Quelle est la différence entre un processus et un thread ? (2–3 phrases)',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Software Engineer',
    question_type: 'shorttext',
    text_en: 'Explain CAP theorem in your own words.',
    text_fr: 'Expliquez le théorème CAP dans vos propres mots.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },

  // ── Product Manager ────────────────────────────────────────
  // qcm
  {
    role: 'Product Manager',
    question_type: 'qcm',
    text_en: 'Which framework is best for prioritizing features by user impact vs. implementation effort?',
    text_fr: 'Quel cadre est le mieux adapté pour prioriser les fonctionnalités par impact utilisateur vs effort d\'implémentation ?',
    options_en: ['RICE', 'MoSCoW', 'ICE', 'Impact-Effort Matrix'],
    options_fr: ['RICE', 'MoSCoW', 'ICE', 'Matrice Impact-Effort'],
    correct_answer: 'Impact-Effort Matrix',
  },
  {
    role: 'Product Manager',
    question_type: 'qcm',
    text_en: 'What does DAU/MAU ratio primarily measure?',
    text_fr: 'Que mesure principalement le ratio DAU/MAU ?',
    options_en: ['Revenue growth', 'User stickiness', 'Churn rate', 'Net Promoter Score'],
    options_fr: ['Croissance des revenus', 'Fidélité des utilisateurs', 'Taux de désabonnement', 'Net Promoter Score'],
    correct_answer: 'User stickiness',
  },
  // dragdrop
  {
    role: 'Product Manager',
    question_type: 'dragdrop',
    text_en: 'Order the product discovery steps: Define Success Metrics, Ideate Solutions, Validate Assumptions, Identify Problem.',
    text_fr: 'Classez les étapes de découverte produit : Définir les métriques de succès, Idéer des solutions, Valider les hypothèses, Identifier le problème.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Product Manager',
    question_type: 'dragdrop',
    text_en: 'Rank these stakeholders by influence on a product roadmap: CEO, Customer, Engineering Lead, Sales, Legal.',
    text_fr: 'Classez ces parties prenantes par influence sur une feuille de route produit : PDG, Client, Lead Ingénierie, Commercial, Juridique.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'Product Manager',
    question_type: 'casestudy',
    text_en: 'User retention drops 20% after a major feature launch. How do you diagnose and respond?',
    text_fr: 'La rétention utilisateurs chute de 20 % après le lancement d\'une fonctionnalité majeure. Comment diagnostiquez-vous et réagissez-vous ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Product Manager',
    question_type: 'casestudy',
    text_en: 'Engineering estimates a feature at 8 weeks; sales promised it in 2. How do you resolve this?',
    text_fr: 'L\'ingénierie estime une fonctionnalité à 8 semaines ; les ventes l\'ont promise en 2. Comment résolvez-vous cela ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'Product Manager',
    question_type: 'simulation',
    text_en: 'Create a one-page PRD for a new onboarding flow that reduces time-to-value by 30%.',
    text_fr: 'Créez un PRD d\'une page pour un nouveau flux d\'onboarding qui réduit le délai de création de valeur de 30 %.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Product Manager',
    question_type: 'simulation',
    text_en: 'Given this usage data dashboard, identify the 3 most important insights and their implications.',
    text_fr: 'À partir de ce tableau de bord de données d\'utilisation, identifiez les 3 insights les plus importants et leurs implications.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'Product Manager',
    question_type: 'audiovideo',
    text_en: 'Pitch a new feature idea for our product in 90 seconds as if presenting to the CEO.',
    text_fr: 'Présentez une nouvelle idée de fonctionnalité pour notre produit en 90 secondes comme si vous vous adressiez au PDG.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Product Manager',
    question_type: 'audiovideo',
    text_en: 'How do you handle a situation where data and user feedback point in opposite directions?',
    text_fr: 'Comment gérez-vous une situation où les données et les retours utilisateurs pointent dans des directions opposées ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'Product Manager',
    question_type: 'shorttext',
    text_en: 'What is the difference between outputs and outcomes in product management?',
    text_fr: 'Quelle est la différence entre les sorties (outputs) et les résultats (outcomes) en gestion de produit ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Product Manager',
    question_type: 'shorttext',
    text_en: 'Describe your approach to writing a good user story.',
    text_fr: 'Décrivez votre approche pour rédiger une bonne user story.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },

  // ── Sales Rep ──────────────────────────────────────────────
  // qcm
  {
    role: 'Sales Rep',
    question_type: 'qcm',
    text_en: 'Which stage of the SPIN Selling model focuses on the consequences of the prospect\'s problem?',
    text_fr: 'Quelle étape du modèle SPIN Selling se concentre sur les conséquences du problème du prospect ?',
    options_en: ['Situation', 'Problem', 'Implication', 'Need-Payoff'],
    options_fr: ['Situation', 'Problème', 'Implication', 'Besoin-Bénéfice'],
    correct_answer: 'Implication',
  },
  {
    role: 'Sales Rep',
    question_type: 'qcm',
    text_en: 'What is the primary goal of a discovery call?',
    text_fr: 'Quel est l\'objectif principal d\'un appel de découverte ?',
    options_en: ['Close the deal', 'Understand the prospect\'s needs and pain points', 'Demonstrate the product', 'Negotiate pricing'],
    options_fr: ['Conclure la vente', 'Comprendre les besoins et points de douleur du prospect', 'Faire une démonstration', 'Négocier les prix'],
    correct_answer: 'Understand the prospect\'s needs and pain points',
  },
  // dragdrop
  {
    role: 'Sales Rep',
    question_type: 'dragdrop',
    text_en: 'Order the B2B sales cycle stages: Prospecting, Proposal, Closing, Discovery, Demo.',
    text_fr: 'Classez les étapes d\'un cycle de vente B2B : Prospection, Proposition, Conclusion, Découverte, Démonstration.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Sales Rep',
    question_type: 'dragdrop',
    text_en: 'Rank these objection types from most to least common in SaaS sales: Price, Timing, Trust, Competition.',
    text_fr: 'Classez ces types d\'objections du plus au moins courant dans les ventes SaaS : Prix, Timing, Confiance, Concurrence.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'Sales Rep',
    question_type: 'casestudy',
    text_en: 'A qualified prospect says "We love the product but need to think about it." How do you respond?',
    text_fr: 'Un prospect qualifié dit : "Nous adorons le produit mais devons y réfléchir." Comment répondez-vous ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Sales Rep',
    question_type: 'casestudy',
    text_en: 'You\'re 3 days from quarter end and need $80K more to hit quota. Describe your action plan.',
    text_fr: 'Vous êtes à 3 jours de la fin du trimestre et il vous manque 80 000 $ pour atteindre votre quota. Décrivez votre plan d\'action.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'Sales Rep',
    question_type: 'simulation',
    text_en: 'Role-play: You are on a cold call. The prospect says "I\'m not interested." Continue the conversation.',
    text_fr: 'Jeu de rôle : Vous êtes en appel à froid. Le prospect dit "Je ne suis pas intéressé." Continuez la conversation.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Sales Rep',
    question_type: 'simulation',
    text_en: 'Draft a follow-up email to a prospect who attended a demo but hasn\'t replied in 5 days.',
    text_fr: 'Rédigez un e-mail de suivi à un prospect qui a assisté à une démo mais n\'a pas répondu depuis 5 jours.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'Sales Rep',
    question_type: 'audiovideo',
    text_en: 'Give a 60-second elevator pitch for our HR assessment platform targeting mid-market companies.',
    text_fr: 'Faites un pitch de 60 secondes pour notre plateforme d\'évaluation RH ciblant les entreprises du marché intermédiaire.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Sales Rep',
    question_type: 'audiovideo',
    text_en: 'Describe a deal you lost and what you learned from it.',
    text_fr: 'Décrivez une vente que vous avez perdue et ce que vous en avez appris.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'Sales Rep',
    question_type: 'shorttext',
    text_en: 'What is the difference between a lead, a prospect, and an opportunity?',
    text_fr: 'Quelle est la différence entre un lead, un prospect et une opportunité ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Sales Rep',
    question_type: 'shorttext',
    text_en: 'How do you research a prospect before a first meeting?',
    text_fr: 'Comment préparez-vous la recherche sur un prospect avant une première réunion ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },

  // ── Customer Support ───────────────────────────────────────
  // qcm
  {
    role: 'Customer Support',
    question_type: 'qcm',
    text_en: 'A customer is furious about a billing error. What is the first step in de-escalation?',
    text_fr: 'Un client est furieux à propos d\'une erreur de facturation. Quelle est la première étape de désescalade ?',
    options_en: ['Explain company policy', 'Acknowledge the issue and empathize', 'Transfer to billing', 'Offer a refund immediately'],
    options_fr: ['Expliquer la politique de l\'entreprise', 'Reconnaître le problème et faire preuve d\'empathie', 'Transférer à la facturation', 'Offrir un remboursement immédiatement'],
    correct_answer: 'Acknowledge the issue and empathize',
  },
  {
    role: 'Customer Support',
    question_type: 'qcm',
    text_en: 'What does CSAT measure?',
    text_fr: 'Que mesure le CSAT ?',
    options_en: ['Customer lifetime value', 'Customer satisfaction with a specific interaction', 'Net Promoter Score', 'First contact resolution rate'],
    options_fr: ['Valeur vie client', 'Satisfaction client pour une interaction spécifique', 'Net Promoter Score', 'Taux de résolution au premier contact'],
    correct_answer: 'Customer satisfaction with a specific interaction',
  },
  // dragdrop
  {
    role: 'Customer Support',
    question_type: 'dragdrop',
    text_en: 'Order these steps for handling a complex support ticket: Investigate Root Cause, Acknowledge, Confirm Resolution, Communicate Update, Apply Fix.',
    text_fr: 'Classez ces étapes pour gérer un ticket d\'assistance complexe : Investiguer la cause, Reconnaître, Confirmer la résolution, Communiquer une mise à jour, Appliquer le correctif.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Customer Support',
    question_type: 'dragdrop',
    text_en: 'Match each channel to its typical response time SLA: Email, Live Chat, Social Media, Phone.',
    text_fr: 'Associez chaque canal à son SLA de temps de réponse typique : E-mail, Chat en direct, Réseaux sociaux, Téléphone.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'Customer Support',
    question_type: 'casestudy',
    text_en: 'A high-value customer threatens to cancel because of repeated technical issues. How do you handle this?',
    text_fr: 'Un client à haute valeur menace d\'annuler en raison de problèmes techniques répétés. Comment gérez-vous cela ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Customer Support',
    question_type: 'casestudy',
    text_en: 'You receive 200 tickets in one hour due to a service outage. How do you prioritize and respond?',
    text_fr: 'Vous recevez 200 tickets en une heure en raison d\'une panne de service. Comment priorisez-vous et répondez-vous ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'Customer Support',
    question_type: 'simulation',
    text_en: 'Write a response to a customer who says their account was charged twice for the same subscription.',
    text_fr: 'Rédigez une réponse à un client qui affirme que son compte a été débité deux fois pour le même abonnement.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Customer Support',
    question_type: 'simulation',
    text_en: 'A customer asks for a refund outside the refund window. Draft a compassionate but policy-compliant response.',
    text_fr: 'Un client demande un remboursement en dehors de la fenêtre de remboursement. Rédigez une réponse compatissante mais conforme à la politique.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'Customer Support',
    question_type: 'audiovideo',
    text_en: 'Simulate a 90-second phone call with an upset customer whose order was delivered to the wrong address.',
    text_fr: 'Simulez un appel téléphonique de 90 secondes avec un client mécontent dont la commande a été livrée à la mauvaise adresse.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Customer Support',
    question_type: 'audiovideo',
    text_en: 'Describe a time you turned a very unhappy customer into a loyal advocate.',
    text_fr: 'Décrivez un moment où vous avez transformé un client très mécontent en défenseur fidèle.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'Customer Support',
    question_type: 'shorttext',
    text_en: 'What is "first contact resolution" and why does it matter?',
    text_fr: 'Qu\'est-ce que la "résolution au premier contact" et pourquoi est-ce important ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Customer Support',
    question_type: 'shorttext',
    text_en: 'When should you escalate a ticket to a senior agent or manager?',
    text_fr: 'Quand devez-vous escalader un ticket à un agent senior ou à un manager ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },

  // ── Marketing Manager ──────────────────────────────────────
  // qcm
  {
    role: 'Marketing Manager',
    question_type: 'qcm',
    text_en: 'Which metric best measures the efficiency of a paid acquisition channel?',
    text_fr: 'Quelle métrique mesure le mieux l\'efficacité d\'un canal d\'acquisition payant ?',
    options_en: ['Impressions', 'Cost per Acquisition (CPA)', 'Click-through Rate', 'Reach'],
    options_fr: ['Impressions', 'Coût par acquisition (CPA)', 'Taux de clics', 'Portée'],
    correct_answer: 'Cost per Acquisition (CPA)',
  },
  {
    role: 'Marketing Manager',
    question_type: 'qcm',
    text_en: 'What does a marketing funnel\'s "consideration" stage primarily involve?',
    text_fr: 'Qu\'implique principalement la phase de "considération" d\'un entonnoir marketing ?',
    options_en: ['Building brand awareness', 'Converting leads to customers', 'Nurturing and educating interested leads', 'Retaining existing customers'],
    options_fr: ['Construire la notoriété de la marque', 'Convertir les leads en clients', 'Nourrir et éduquer les leads intéressés', 'Fidéliser les clients existants'],
    correct_answer: 'Nurturing and educating interested leads',
  },
  // dragdrop
  {
    role: 'Marketing Manager',
    question_type: 'dragdrop',
    text_en: 'Order a campaign launch process: Brief, Launch, Review Analytics, Create Assets, Set KPIs.',
    text_fr: 'Classez un processus de lancement de campagne : Brief, Lancement, Analyse des données, Création d\'assets, Définir les KPIs.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Marketing Manager',
    question_type: 'dragdrop',
    text_en: 'Rank these channels by typical B2B lead quality: LinkedIn Ads, SEO, Cold Email, Webinars.',
    text_fr: 'Classez ces canaux par qualité typique de lead B2B : LinkedIn Ads, SEO, E-mail froid, Webinaires.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'Marketing Manager',
    question_type: 'casestudy',
    text_en: 'Your campaign\'s CTR is high but conversion rate is low. What do you investigate first?',
    text_fr: 'Le CTR de votre campagne est élevé mais le taux de conversion est faible. Qu\'investiguez-vous en premier ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Marketing Manager',
    question_type: 'casestudy',
    text_en: 'You have a €50K budget for Q3 to grow MQLs by 40%. How do you allocate it?',
    text_fr: 'Vous disposez d\'un budget de 50 000 € pour le T3 afin d\'augmenter les MQL de 40 %. Comment l\'allouez-vous ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'Marketing Manager',
    question_type: 'simulation',
    text_en: 'Write a subject line and email body for a product launch announcement targeting HR directors.',
    text_fr: 'Rédigez un objet et le corps d\'un e-mail pour une annonce de lancement de produit ciblant les directeurs RH.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Marketing Manager',
    question_type: 'simulation',
    text_en: 'Analyze this A/B test result table and recommend which variant to roll out.',
    text_fr: 'Analysez ce tableau de résultats de test A/B et recommandez quelle variante déployer.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'Marketing Manager',
    question_type: 'audiovideo',
    text_en: 'Pitch a go-to-market strategy for entering a new European market in 90 seconds.',
    text_fr: 'Présentez une stratégie de mise sur le marché pour entrer sur un nouveau marché européen en 90 secondes.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Marketing Manager',
    question_type: 'audiovideo',
    text_en: 'Describe a campaign you ran that underperformed and how you adapted.',
    text_fr: 'Décrivez une campagne que vous avez menée qui n\'a pas atteint ses objectifs et comment vous vous êtes adapté.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'Marketing Manager',
    question_type: 'shorttext',
    text_en: 'What is brand positioning and how do you define it for a new product?',
    text_fr: 'Qu\'est-ce que le positionnement de marque et comment le définissez-vous pour un nouveau produit ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Marketing Manager',
    question_type: 'shorttext',
    text_en: 'Explain the difference between inbound and outbound marketing strategies.',
    text_fr: 'Expliquez la différence entre les stratégies de marketing entrant et sortant.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },

  // ── Data Analyst ───────────────────────────────────────────
  // qcm
  {
    role: 'Data Analyst',
    question_type: 'qcm',
    text_en: 'Which SQL clause filters rows after a GROUP BY aggregation?',
    text_fr: 'Quelle clause SQL filtre les lignes après une agrégation GROUP BY ?',
    options_en: ['WHERE', 'HAVING', 'FILTER', 'ON'],
    options_fr: ['WHERE', 'HAVING', 'FILTER', 'ON'],
    correct_answer: 'HAVING',
  },
  {
    role: 'Data Analyst',
    question_type: 'qcm',
    text_en: 'Correlation between two variables of 0.03 most likely indicates:',
    text_fr: 'Une corrélation de 0,03 entre deux variables indique le plus probablement :',
    options_en: ['Strong positive relationship', 'Strong negative relationship', 'No linear relationship', 'Perfect correlation'],
    options_fr: ['Relation positive forte', 'Relation négative forte', 'Aucune relation linéaire', 'Corrélation parfaite'],
    correct_answer: 'No linear relationship',
  },
  // dragdrop
  {
    role: 'Data Analyst',
    question_type: 'dragdrop',
    text_en: 'Order the data analysis workflow: Collect, Clean, Visualize, Analyze, Share Insights.',
    text_fr: 'Classez le flux de travail d\'analyse de données : Collecter, Nettoyer, Visualiser, Analyser, Partager les insights.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Data Analyst',
    question_type: 'dragdrop',
    text_en: 'Match each chart type to its best use case: Bar Chart, Line Chart, Scatter Plot, Pie Chart.',
    text_fr: 'Associez chaque type de graphique à son meilleur cas d\'usage : Graphique à barres, Courbe, Nuage de points, Camembert.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'Data Analyst',
    question_type: 'casestudy',
    text_en: 'Sales data shows a 15% drop in Week 3. The dataset has 6 months of weekly data. How do you investigate?',
    text_fr: 'Les données de vente montrent une baisse de 15 % en semaine 3. Le jeu de données couvre 6 mois de données hebdomadaires. Comment investiguez-vous ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Data Analyst',
    question_type: 'casestudy',
    text_en: 'A stakeholder asks for a dashboard that "shows everything." How do you scope and design it?',
    text_fr: 'Un stakeholder demande un tableau de bord qui "montre tout". Comment le définissez-vous et le concevez-vous ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'Data Analyst',
    question_type: 'simulation',
    text_en: 'Write a SQL query to compute the 7-day rolling average of daily active users.',
    text_fr: 'Rédigez une requête SQL pour calculer la moyenne mobile sur 7 jours des utilisateurs actifs quotidiens.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Data Analyst',
    question_type: 'simulation',
    text_en: 'Given a dataset with null values in 3 columns, describe how you would handle each type of missing data.',
    text_fr: 'Étant donné un jeu de données avec des valeurs nulles dans 3 colonnes, décrivez comment vous géreriez chaque type de données manquantes.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'Data Analyst',
    question_type: 'audiovideo',
    text_en: 'Present a key finding from a fictional customer churn analysis to a non-technical audience in 2 minutes.',
    text_fr: 'Présentez une découverte clé d\'une analyse fictive du churn client à un public non technique en 2 minutes.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Data Analyst',
    question_type: 'audiovideo',
    text_en: 'Describe a time your analysis changed a business decision. What was the outcome?',
    text_fr: 'Décrivez un moment où votre analyse a changé une décision commerciale. Quel a été le résultat ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'Data Analyst',
    question_type: 'shorttext',
    text_en: 'What is the difference between a JOIN and a UNION in SQL?',
    text_fr: 'Quelle est la différence entre un JOIN et un UNION en SQL ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Data Analyst',
    question_type: 'shorttext',
    text_en: 'Explain what a p-value tells you in hypothesis testing.',
    text_fr: 'Expliquez ce qu\'une p-value vous indique dans un test d\'hypothèse.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },

  // ── UX Designer ────────────────────────────────────────────
  // qcm
  {
    role: 'UX Designer',
    question_type: 'qcm',
    text_en: 'Which usability heuristic states that the system should always keep users informed about what is going on?',
    text_fr: 'Quelle heuristique d\'utilisabilité stipule que le système doit toujours tenir les utilisateurs informés de ce qui se passe ?',
    options_en: ['User Control & Freedom', 'Visibility of System Status', 'Error Prevention', 'Consistency & Standards'],
    options_fr: ['Contrôle et liberté de l\'utilisateur', 'Visibilité de l\'état du système', 'Prévention des erreurs', 'Cohérence et standards'],
    correct_answer: 'Visibility of System Status',
  },
  {
    role: 'UX Designer',
    question_type: 'qcm',
    text_en: 'What is the minimum tap target size recommended by WCAG for touch interfaces?',
    text_fr: 'Quelle est la taille minimale de cible tactile recommandée par les WCAG pour les interfaces tactiles ?',
    options_en: ['24×24 px', '32×32 px', '44×44 px', '48×48 px'],
    options_fr: ['24×24 px', '32×32 px', '44×44 px', '48×48 px'],
    correct_answer: '44×44 px',
  },
  // dragdrop
  {
    role: 'UX Designer',
    question_type: 'dragdrop',
    text_en: 'Order the UX design process: Prototype, Research, Define, Test, Ideate.',
    text_fr: 'Classez le processus de conception UX : Prototype, Recherche, Définir, Tester, Idéer.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'UX Designer',
    question_type: 'dragdrop',
    text_en: 'Match each research method to its category: Card Sort, A/B Test, Usability Test, Survey.',
    text_fr: 'Associez chaque méthode de recherche à sa catégorie : Tri de cartes, Test A/B, Test d\'utilisabilité, Sondage.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'UX Designer',
    question_type: 'casestudy',
    text_en: 'Users drop off at step 3 of a 4-step onboarding flow. How do you diagnose and fix this?',
    text_fr: 'Les utilisateurs abandonnent à l\'étape 3 d\'un flux d\'onboarding en 4 étapes. Comment diagnostiquez-vous et corrigez-vous cela ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'UX Designer',
    question_type: 'casestudy',
    text_en: 'A stakeholder wants to add 5 new items to the navigation. How do you push back using UX principles?',
    text_fr: 'Un stakeholder veut ajouter 5 nouveaux éléments à la navigation. Comment vous opposez-vous en utilisant les principes UX ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'UX Designer',
    question_type: 'simulation',
    text_en: 'Critique the wireframe shown: identify 3 usability issues and propose solutions.',
    text_fr: 'Critiquez le wireframe présenté : identifiez 3 problèmes d\'utilisabilité et proposez des solutions.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'UX Designer',
    question_type: 'simulation',
    text_en: 'Sketch (describe in text) a mobile check-out flow for a 3-item cart in an e-commerce app.',
    text_fr: 'Esquissez (décrivez en texte) un flux de paiement mobile pour un panier de 3 articles dans une application e-commerce.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'UX Designer',
    question_type: 'audiovideo',
    text_en: 'Walk us through a design decision you made that was initially unpopular but ultimately validated by data.',
    text_fr: 'Présentez une décision de design que vous avez prise et qui était initialement impopulaire mais finalement validée par les données.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'UX Designer',
    question_type: 'audiovideo',
    text_en: 'In 90 seconds, explain the difference between UX research and UI design to a non-designer.',
    text_fr: 'En 90 secondes, expliquez la différence entre la recherche UX et le design UI à un non-designer.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'UX Designer',
    question_type: 'shorttext',
    text_en: 'What is the difference between a wireframe, a mockup, and a prototype?',
    text_fr: 'Quelle est la différence entre un wireframe, une maquette et un prototype ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'UX Designer',
    question_type: 'shorttext',
    text_en: 'Describe two accessibility best practices every digital product should implement.',
    text_fr: 'Décrivez deux bonnes pratiques d\'accessibilité que tout produit numérique devrait mettre en œuvre.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },

  // ── Operations Manager ─────────────────────────────────────
  // qcm
  {
    role: 'Operations Manager',
    question_type: 'qcm',
    text_en: 'Which process improvement methodology focuses on reducing waste and increasing flow?',
    text_fr: 'Quelle méthodologie d\'amélioration des processus se concentre sur la réduction des gaspillages et l\'augmentation du flux ?',
    options_en: ['Six Sigma', 'Lean', 'Agile', 'ITIL'],
    options_fr: ['Six Sigma', 'Lean', 'Agile', 'ITIL'],
    correct_answer: 'Lean',
  },
  {
    role: 'Operations Manager',
    question_type: 'qcm',
    text_en: 'What does OEE (Overall Equipment Effectiveness) measure?',
    text_fr: 'Que mesure l\'OEE (Efficacité Globale des Équipements) ?',
    options_en: ['Employee productivity', 'Manufacturing productivity combining availability, performance, and quality', 'Revenue per unit', 'Defect rate only'],
    options_fr: ['Productivité des employés', 'Productivité de fabrication combinant disponibilité, performance et qualité', 'Revenu par unité', 'Taux de défaut uniquement'],
    correct_answer: 'Manufacturing productivity combining availability, performance, and quality',
  },
  // dragdrop
  {
    role: 'Operations Manager',
    question_type: 'dragdrop',
    text_en: 'Order the PDCA cycle: Check, Do, Plan, Act.',
    text_fr: 'Classez le cycle PDCA : Vérifier, Faire, Planifier, Agir.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Operations Manager',
    question_type: 'dragdrop',
    text_en: 'Rank these risks by typical operational impact: Supply Chain Disruption, Staff Turnover, IT Outage, Regulatory Change.',
    text_fr: 'Classez ces risques par impact opérationnel typique : Perturbation de la chaîne d\'approvisionnement, Rotation du personnel, Panne informatique, Changement réglementaire.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // casestudy
  {
    role: 'Operations Manager',
    question_type: 'casestudy',
    text_en: 'A key supplier missed 3 consecutive deliveries. How do you manage the short and long-term impact?',
    text_fr: 'Un fournisseur clé a manqué 3 livraisons consécutives. Comment gérez-vous l\'impact à court et long terme ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Operations Manager',
    question_type: 'casestudy',
    text_en: 'You need to reduce operational costs by 15% without layoffs. What strategies do you consider?',
    text_fr: 'Vous devez réduire les coûts opérationnels de 15 % sans licenciements. Quelles stratégies envisagez-vous ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // simulation
  {
    role: 'Operations Manager',
    question_type: 'simulation',
    text_en: 'Create a simple risk matrix for a new warehouse expansion project (identify 5 risks, rate likelihood × impact).',
    text_fr: 'Créez une matrice de risque simple pour un nouveau projet d\'expansion d\'entrepôt (identifiez 5 risques, évaluez probabilité × impact).',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Operations Manager',
    question_type: 'simulation',
    text_en: 'Draft a cross-functional meeting agenda for a quarterly business review involving Sales, Finance, and Ops.',
    text_fr: 'Rédigez un ordre du jour de réunion transversale pour une revue trimestrielle impliquant les Ventes, la Finance et les Opérations.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // audiovideo
  {
    role: 'Operations Manager',
    question_type: 'audiovideo',
    text_en: 'Describe a process you redesigned that delivered measurable efficiency gains.',
    text_fr: 'Décrivez un processus que vous avez repensé et qui a généré des gains d\'efficacité mesurables.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Operations Manager',
    question_type: 'audiovideo',
    text_en: 'How do you align operations with the overall company strategy? Walk us through your approach.',
    text_fr: 'Comment alignez-vous les opérations avec la stratégie globale de l\'entreprise ? Présentez votre approche.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  // shorttext
  {
    role: 'Operations Manager',
    question_type: 'shorttext',
    text_en: 'What is a KPI and how do you select the right ones for an operations team?',
    text_fr: 'Qu\'est-ce qu\'un KPI et comment choisissez-vous les bons pour une équipe opérationnelle ?',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
  {
    role: 'Operations Manager',
    question_type: 'shorttext',
    text_en: 'Describe the difference between efficiency and effectiveness in operations.',
    text_fr: 'Décrivez la différence entre efficience et efficacité dans les opérations.',
    options_en: null,
    options_fr: null,
    correct_answer: null,
  },
]

// ============================================================
// 40 Mock Candidates (5 per role)
// ============================================================

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

const mockCandidates = [
  // ── Software Engineer ──────────────────────────────────────
  {
    full_name: 'Lucas Tremblay',
    email: 'lucas.tremblay@techcorp-mock.com',
    role: 'Software Engineer',
    avatar_initials: 'LT',
    avatar_color: ROLE_COLORS['Software Engineer'],
    crima_score: 82,
    logic_score: 88,
    comms_score: 76,
    job_skill_score: 85,
    trust_score: 83,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(12),
  },
  {
    full_name: 'Aiko Nakamura',
    email: 'aiko.nakamura@devstudio-mock.com',
    role: 'Software Engineer',
    avatar_initials: 'AN',
    avatar_color: ROLE_COLORS['Software Engineer'],
    crima_score: 74,
    logic_score: 80,
    comms_score: 68,
    job_skill_score: 77,
    trust_score: 72,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(28),
  },
  {
    full_name: 'Kwame Asante',
    email: 'kwame.asante@softworks-mock.com',
    role: 'Software Engineer',
    avatar_initials: 'KA',
    avatar_color: ROLE_COLORS['Software Engineer'],
    crima_score: 68,
    logic_score: 72,
    comms_score: 65,
    job_skill_score: 70,
    trust_score: 66,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Pending',
    test_date: daysAgo(5),
  },
  {
    full_name: 'Sophie Lefebvre',
    email: 'sophie.lefebvre@codelab-mock.com',
    role: 'Software Engineer',
    avatar_initials: 'SL',
    avatar_color: ROLE_COLORS['Software Engineer'],
    crima_score: 79,
    logic_score: 82,
    comms_score: 78,
    job_skill_score: 80,
    trust_score: 77,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Reviewed',
    test_date: daysAgo(45),
  },
  {
    full_name: 'Raj Patel',
    email: 'raj.patel@techventure-mock.com',
    role: 'Software Engineer',
    avatar_initials: 'RP',
    avatar_color: ROLE_COLORS['Software Engineer'],
    crima_score: 57,
    logic_score: 60,
    comms_score: 55,
    job_skill_score: 58,
    trust_score: 53,
    fraud_flag_severity: 'High',
    fraud_flag_count: 3,
    status: 'Rejected',
    test_date: daysAgo(62),
  },

  // ── Product Manager ────────────────────────────────────────
  {
    full_name: 'Camille Fontaine',
    email: 'camille.fontaine@producthub-mock.com',
    role: 'Product Manager',
    avatar_initials: 'CF',
    avatar_color: ROLE_COLORS['Product Manager'],
    crima_score: 81,
    logic_score: 79,
    comms_score: 85,
    job_skill_score: 80,
    trust_score: 82,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(18),
  },
  {
    full_name: 'Daniel Osei',
    email: 'daniel.osei@innovateco-mock.com',
    role: 'Product Manager',
    avatar_initials: 'DO',
    avatar_color: ROLE_COLORS['Product Manager'],
    crima_score: 73,
    logic_score: 70,
    comms_score: 78,
    job_skill_score: 74,
    trust_score: 71,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(33),
  },
  {
    full_name: 'Mei-Ling Chen',
    email: 'meiling.chen@digitalpm-mock.com',
    role: 'Product Manager',
    avatar_initials: 'MC',
    avatar_color: ROLE_COLORS['Product Manager'],
    crima_score: 84,
    logic_score: 83,
    comms_score: 87,
    job_skill_score: 84,
    trust_score: 86,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(7),
  },
  {
    full_name: 'Antoine Bernard',
    email: 'antoine.bernard@pmstudio-mock.com',
    role: 'Product Manager',
    avatar_initials: 'AB',
    avatar_color: ROLE_COLORS['Product Manager'],
    crima_score: 66,
    logic_score: 63,
    comms_score: 70,
    job_skill_score: 67,
    trust_score: 64,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Pending',
    test_date: daysAgo(3),
  },
  {
    full_name: 'Priya Sharma',
    email: 'priya.sharma@visionpm-mock.com',
    role: 'Product Manager',
    avatar_initials: 'PS',
    avatar_color: ROLE_COLORS['Product Manager'],
    crima_score: 58,
    logic_score: 55,
    comms_score: 62,
    job_skill_score: 59,
    trust_score: 56,
    fraud_flag_severity: 'High',
    fraud_flag_count: 3,
    status: 'Rejected',
    test_date: daysAgo(75),
  },

  // ── Sales Rep ──────────────────────────────────────────────
  {
    full_name: 'Jordan Mitchell',
    email: 'jordan.mitchell@salesforce-mock.com',
    role: 'Sales Rep',
    avatar_initials: 'JM',
    avatar_color: ROLE_COLORS['Sales Rep'],
    crima_score: 77,
    logic_score: 73,
    comms_score: 84,
    job_skill_score: 79,
    trust_score: 75,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(21),
  },
  {
    full_name: 'Fatima Diallo',
    email: 'fatima.diallo@b2bsales-mock.com',
    role: 'Sales Rep',
    avatar_initials: 'FD',
    avatar_color: ROLE_COLORS['Sales Rep'],
    crima_score: 71,
    logic_score: 67,
    comms_score: 79,
    job_skill_score: 73,
    trust_score: 70,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(38),
  },
  {
    full_name: 'Marco Ricci',
    email: 'marco.ricci@eurosales-mock.com',
    role: 'Sales Rep',
    avatar_initials: 'MR',
    avatar_color: ROLE_COLORS['Sales Rep'],
    crima_score: 65,
    logic_score: 61,
    comms_score: 72,
    job_skill_score: 66,
    trust_score: 63,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Pending',
    test_date: daysAgo(10),
  },
  {
    full_name: 'Yuki Tanaka',
    email: 'yuki.tanaka@salesops-mock.com',
    role: 'Sales Rep',
    avatar_initials: 'YT',
    avatar_color: ROLE_COLORS['Sales Rep'],
    crima_score: 75,
    logic_score: 72,
    comms_score: 81,
    job_skill_score: 76,
    trust_score: 74,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Reviewed',
    test_date: daysAgo(50),
  },
  {
    full_name: 'Ibrahim Touré',
    email: 'ibrahim.toure@growthsales-mock.com',
    role: 'Sales Rep',
    avatar_initials: 'IT',
    avatar_color: ROLE_COLORS['Sales Rep'],
    crima_score: 56,
    logic_score: 52,
    comms_score: 63,
    job_skill_score: 57,
    trust_score: 54,
    fraud_flag_severity: 'High',
    fraud_flag_count: 3,
    status: 'Rejected',
    test_date: daysAgo(88),
  },

  // ── Customer Support ───────────────────────────────────────
  {
    full_name: 'Emma Rousseau',
    email: 'emma.rousseau@supportco-mock.com',
    role: 'Customer Support',
    avatar_initials: 'ER',
    avatar_color: ROLE_COLORS['Customer Support'],
    crima_score: 78,
    logic_score: 74,
    comms_score: 86,
    job_skill_score: 79,
    trust_score: 80,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(15),
  },
  {
    full_name: 'Samuel Koffi',
    email: 'samuel.koffi@helpdesk-mock.com',
    role: 'Customer Support',
    avatar_initials: 'SK',
    avatar_color: ROLE_COLORS['Customer Support'],
    crima_score: 70,
    logic_score: 66,
    comms_score: 78,
    job_skill_score: 71,
    trust_score: 69,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(40),
  },
  {
    full_name: 'Natasha Ivanova',
    email: 'natasha.ivanova@cxteam-mock.com',
    role: 'Customer Support',
    avatar_initials: 'NI',
    avatar_color: ROLE_COLORS['Customer Support'],
    crima_score: 83,
    logic_score: 79,
    comms_score: 90,
    job_skill_score: 84,
    trust_score: 85,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(9),
  },
  {
    full_name: 'Olivier Dupont',
    email: 'olivier.dupont@servicedesk-mock.com',
    role: 'Customer Support',
    avatar_initials: 'OD',
    avatar_color: ROLE_COLORS['Customer Support'],
    crima_score: 64,
    logic_score: 60,
    comms_score: 71,
    job_skill_score: 65,
    trust_score: 62,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Pending',
    test_date: daysAgo(4),
  },
  {
    full_name: 'Amara Diop',
    email: 'amara.diop@supportpro-mock.com',
    role: 'Customer Support',
    avatar_initials: 'AD',
    avatar_color: ROLE_COLORS['Customer Support'],
    crima_score: 59,
    logic_score: 55,
    comms_score: 66,
    job_skill_score: 60,
    trust_score: 57,
    fraud_flag_severity: 'High',
    fraud_flag_count: 3,
    status: 'Rejected',
    test_date: daysAgo(95),
  },

  // ── Marketing Manager ──────────────────────────────────────
  {
    full_name: 'Clara Moreau',
    email: 'clara.moreau@mktgteam-mock.com',
    role: 'Marketing Manager',
    avatar_initials: 'CM',
    avatar_color: ROLE_COLORS['Marketing Manager'],
    crima_score: 76,
    logic_score: 72,
    comms_score: 83,
    job_skill_score: 77,
    trust_score: 78,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(20),
  },
  {
    full_name: 'Hiroshi Yamamoto',
    email: 'hiroshi.yamamoto@brandworks-mock.com',
    role: 'Marketing Manager',
    avatar_initials: 'HY',
    avatar_color: ROLE_COLORS['Marketing Manager'],
    crima_score: 69,
    logic_score: 65,
    comms_score: 76,
    job_skill_score: 70,
    trust_score: 68,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(35),
  },
  {
    full_name: 'Lena Schwarzmann',
    email: 'lena.schwarzmann@contentmgr-mock.com',
    role: 'Marketing Manager',
    avatar_initials: 'LS',
    avatar_color: ROLE_COLORS['Marketing Manager'],
    crima_score: 80,
    logic_score: 77,
    comms_score: 85,
    job_skill_score: 81,
    trust_score: 82,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Reviewed',
    test_date: daysAgo(55),
  },
  {
    full_name: 'Moussa Ba',
    email: 'moussa.ba@growthmkt-mock.com',
    role: 'Marketing Manager',
    avatar_initials: 'MB',
    avatar_color: ROLE_COLORS['Marketing Manager'],
    crima_score: 63,
    logic_score: 59,
    comms_score: 70,
    job_skill_score: 64,
    trust_score: 61,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Pending',
    test_date: daysAgo(6),
  },
  {
    full_name: 'Sarah Williams',
    email: 'sarah.williams@digitalmkt-mock.com',
    role: 'Marketing Manager',
    avatar_initials: 'SW',
    avatar_color: ROLE_COLORS['Marketing Manager'],
    crima_score: 55,
    logic_score: 51,
    comms_score: 62,
    job_skill_score: 56,
    trust_score: 53,
    fraud_flag_severity: 'High',
    fraud_flag_count: 3,
    status: 'Rejected',
    test_date: daysAgo(110),
  },

  // ── Data Analyst ───────────────────────────────────────────
  {
    full_name: 'Léa Bouchard',
    email: 'lea.bouchard@dataworks-mock.com',
    role: 'Data Analyst',
    avatar_initials: 'LB',
    avatar_color: ROLE_COLORS['Data Analyst'],
    crima_score: 85,
    logic_score: 91,
    comms_score: 78,
    job_skill_score: 87,
    trust_score: 84,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(14),
  },
  {
    full_name: 'Chidi Okafor',
    email: 'chidi.okafor@analyticsco-mock.com',
    role: 'Data Analyst',
    avatar_initials: 'CO',
    avatar_color: ROLE_COLORS['Data Analyst'],
    crima_score: 72,
    logic_score: 78,
    comms_score: 65,
    job_skill_score: 74,
    trust_score: 71,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(42),
  },
  {
    full_name: 'Ingrid Larsson',
    email: 'ingrid.larsson@insightlab-mock.com',
    role: 'Data Analyst',
    avatar_initials: 'IL',
    avatar_color: ROLE_COLORS['Data Analyst'],
    crima_score: 77,
    logic_score: 83,
    comms_score: 70,
    job_skill_score: 79,
    trust_score: 76,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Reviewed',
    test_date: daysAgo(60),
  },
  {
    full_name: 'Alexei Petrov',
    email: 'alexei.petrov@datateam-mock.com',
    role: 'Data Analyst',
    avatar_initials: 'AP',
    avatar_color: ROLE_COLORS['Data Analyst'],
    crima_score: 67,
    logic_score: 71,
    comms_score: 60,
    job_skill_score: 68,
    trust_score: 65,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Pending',
    test_date: daysAgo(2),
  },
  {
    full_name: 'Nia Freeman',
    email: 'nia.freeman@bireports-mock.com',
    role: 'Data Analyst',
    avatar_initials: 'NF',
    avatar_color: ROLE_COLORS['Data Analyst'],
    crima_score: 60,
    logic_score: 64,
    comms_score: 53,
    job_skill_score: 61,
    trust_score: 58,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Rejected',
    test_date: daysAgo(80),
  },

  // ── UX Designer ────────────────────────────────────────────
  {
    full_name: 'Manon Dupuis',
    email: 'manon.dupuis@uxstudio-mock.com',
    role: 'UX Designer',
    avatar_initials: 'MD',
    avatar_color: ROLE_COLORS['UX Designer'],
    crima_score: 79,
    logic_score: 75,
    comms_score: 84,
    job_skill_score: 81,
    trust_score: 80,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(16),
  },
  {
    full_name: 'Kofi Mensah',
    email: 'kofi.mensah@designcraft-mock.com',
    role: 'UX Designer',
    avatar_initials: 'KM',
    avatar_color: ROLE_COLORS['UX Designer'],
    crima_score: 72,
    logic_score: 68,
    comms_score: 78,
    job_skill_score: 73,
    trust_score: 71,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(37),
  },
  {
    full_name: 'Hana Yoshida',
    email: 'hana.yoshida@uxlab-mock.com',
    role: 'UX Designer',
    avatar_initials: 'HY',
    avatar_color: ROLE_COLORS['UX Designer'],
    crima_score: 83,
    logic_score: 79,
    comms_score: 88,
    job_skill_score: 85,
    trust_score: 84,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(11),
  },
  {
    full_name: 'Thomas Müller',
    email: 'thomas.muller@prototypeco-mock.com',
    role: 'UX Designer',
    avatar_initials: 'TM',
    avatar_color: ROLE_COLORS['UX Designer'],
    crima_score: 63,
    logic_score: 59,
    comms_score: 70,
    job_skill_score: 64,
    trust_score: 62,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 2,
    status: 'Pending',
    test_date: daysAgo(1),
  },
  {
    full_name: 'Adeola Ogunwale',
    email: 'adeola.ogunwale@userdesign-mock.com',
    role: 'UX Designer',
    avatar_initials: 'AO',
    avatar_color: ROLE_COLORS['UX Designer'],
    crima_score: 56,
    logic_score: 52,
    comms_score: 63,
    job_skill_score: 57,
    trust_score: 55,
    fraud_flag_severity: 'High',
    fraud_flag_count: 3,
    status: 'Rejected',
    test_date: daysAgo(100),
  },

  // ── Operations Manager ─────────────────────────────────────
  {
    full_name: 'Pierre Lacroix',
    email: 'pierre.lacroix@opsmanager-mock.com',
    role: 'Operations Manager',
    avatar_initials: 'PL',
    avatar_color: ROLE_COLORS['Operations Manager'],
    crima_score: 76,
    logic_score: 79,
    comms_score: 74,
    job_skill_score: 77,
    trust_score: 75,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Hired',
    test_date: daysAgo(19),
  },
  {
    full_name: 'Grace Adeyemi',
    email: 'grace.adeyemi@opsco-mock.com',
    role: 'Operations Manager',
    avatar_initials: 'GA',
    avatar_color: ROLE_COLORS['Operations Manager'],
    crima_score: 70,
    logic_score: 73,
    comms_score: 68,
    job_skill_score: 71,
    trust_score: 69,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 1,
    status: 'Reviewed',
    test_date: daysAgo(43),
  },
  {
    full_name: 'Erik Svensson',
    email: 'erik.svensson@logisticspro-mock.com',
    role: 'Operations Manager',
    avatar_initials: 'ES',
    avatar_color: ROLE_COLORS['Operations Manager'],
    crima_score: 80,
    logic_score: 83,
    comms_score: 77,
    job_skill_score: 81,
    trust_score: 79,
    fraud_flag_severity: 'Low',
    fraud_flag_count: 0,
    status: 'Reviewed',
    test_date: daysAgo(58),
  },
  {
    full_name: 'Zara Khan',
    email: 'zara.khan@supplyops-mock.com',
    role: 'Operations Manager',
    avatar_initials: 'ZK',
    avatar_color: ROLE_COLORS['Operations Manager'],
    crima_score: 65,
    logic_score: 68,
    comms_score: 63,
    job_skill_score: 66,
    trust_score: 64,
    fraud_flag_severity: 'Medium',
    fraud_flag_count: 1,
    status: 'Pending',
    test_date: daysAgo(8),
  },
  {
    full_name: 'Bastien Leroy',
    email: 'bastien.leroy@procureops-mock.com',
    role: 'Operations Manager',
    avatar_initials: 'BL',
    avatar_color: ROLE_COLORS['Operations Manager'],
    crima_score: 58,
    logic_score: 61,
    comms_score: 56,
    job_skill_score: 59,
    trust_score: 57,
    fraud_flag_severity: 'High',
    fraud_flag_count: 2,
    status: 'Rejected',
    test_date: daysAgo(120),
  },
]

// ============================================================
// Main seed function
// ============================================================
async function main() {
  console.log('Starting CrismaTest database seed...')
  console.log(`Target: ${testTemplates.length} templates, ${questions.length} questions, ${mockCandidates.length} candidates`)
  console.log('---')

  // 1. Seed test_templates
  console.log('Seeding test_templates...')
  const { data: templateData, error: templateError } = await supabase
    .from('test_templates')
    .insert(testTemplates)
    .select('id, role')

  if (templateError) {
    console.error('Failed to seed test_templates:', templateError.message)
    process.exit(1)
  }
  console.log(`  ✓ Inserted ${templateData?.length ?? 0} test_templates`)

  // 2. Seed questions
  console.log('Seeding questions...')
  const { data: questionData, error: questionError } = await supabase
    .from('questions')
    .insert(questions)
    .select('id')

  if (questionError) {
    console.error('Failed to seed questions:', questionError.message)
    process.exit(1)
  }
  console.log(`  ✓ Inserted ${questionData?.length ?? 0} questions`)

  // 3. Seed mock_candidates
  console.log('Seeding mock_candidates...')
  const { data: candidateData, error: candidateError } = await supabase
    .from('mock_candidates')
    .insert(mockCandidates)
    .select('id')

  if (candidateError) {
    console.error('Failed to seed mock_candidates:', candidateError.message)
    process.exit(1)
  }
  console.log(`  ✓ Inserted ${candidateData?.length ?? 0} mock_candidates`)

  console.log('---')
  console.log('Seed complete.')
  console.log(`  test_templates: ${templateData?.length ?? 0}`)
  console.log(`  questions:      ${questionData?.length ?? 0}`)
  console.log(`  candidates:     ${candidateData?.length ?? 0}`)

  process.exit(0)
}

main().catch((err: unknown) => {
  console.error('Unexpected error during seed:', err)
  process.exit(1)
})
