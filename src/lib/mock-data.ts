// src/lib/mock-data.ts
// Static MOCK_TEST used by all /test/[id]/* pages in Phase 4.
// Phase 5 replaces these reads with GET /api/tests/[id].
// Use id='sample' in all Phase 4 development: /test/sample/intro

export interface MockQuestion {
  id: string
  type: 'qcm' | 'dragdrop' | 'casestudy' | 'simulation' | 'audiovideo' | 'shorttext'
  module: string
  question: string
  options?: string[]        // qcm
  items?: string[]          // dragdrop — items to rank
  scenario?: string         // casestudy / simulation
  subQuestions?: string[]   // casestudy
  branches?: Record<string, string>  // simulation: answer → next question text
  wordLimit?: number        // shorttext
}

export interface MockTest {
  id: string
  slug: string
  role: string
  duration: number          // minutes
  modules: string[]
  questionCount: number
  questions: MockQuestion[]
}

export const MOCK_TEST: MockTest = {
  id: 'sample',
  slug: 'customer-support-specialist',
  role: 'Customer Support Specialist',
  duration: 15,
  modules: ['Logic & Reasoning', 'Communication', 'Job Skills', 'Trust & Consistency'],
  questionCount: 12,
  questions: [
    {
      id: 'q1',
      type: 'qcm',
      module: 'Logic & Reasoning',
      question: 'A customer reports their order has not arrived after 14 days. Which response is most appropriate?',
      options: [
        'A. Ask the customer to wait another week before contacting support.',
        'B. Apologize, check the order status, and offer a replacement or refund.',
        'C. Tell the customer shipping delays are common and unavoidable.',
        'D. Escalate immediately to management without investigating.',
      ],
    },
    {
      id: 'q2',
      type: 'dragdrop',
      module: 'Logic & Reasoning',
      question: 'Rank the following customer support priorities from most important (1) to least important (4):',
      items: [
        'Resolve the customer issue',
        'Meet response time SLA',
        'Document the ticket properly',
        'Follow the escalation process',
      ],
    },
    {
      id: 'q3',
      type: 'casestudy',
      module: 'Job Skills',
      question: 'Read the scenario and answer the three questions below.',
      scenario: 'A long-term customer contacts support. They are frustrated because they were charged twice for the same subscription. They say this is the third issue they have had this year and they are considering cancelling.',
      subQuestions: [
        'What is your immediate first step in this situation?',
        'How do you address the customer\'s statement about considering cancellation?',
        'What follow-up action do you take after resolving the billing issue?',
      ],
    },
    {
      id: 'q4',
      type: 'simulation',
      module: 'Communication',
      question: 'A customer messages: "My account is locked and I have a meeting in 10 minutes!" Select your response.',
      scenario: 'The customer is urgent and stressed.',
      options: [
        'A. "I understand the urgency. Let me verify your identity quickly so I can unlock your account right now."',
        'B. "Account unlocks take 24 hours due to security protocols."',
        'C. "Please fill out our support form and we will get back to you."',
        'D. "Can you tell me more about why your account was locked?"',
      ],
    },
    {
      id: 'q5',
      type: 'audiovideo',
      module: 'Communication',
      question: 'Record a 60-second response explaining how you would handle a situation where you made an error that affected a customer.',
    },
    {
      id: 'q6',
      type: 'shorttext',
      module: 'Communication',
      question: 'In your own words, describe what "customer success" means and how it differs from "customer support".',
      wordLimit: 150,
    },
    {
      id: 'q7',
      type: 'qcm',
      module: 'Trust & Consistency',
      question: 'Which of the following represents the best approach when you do not know the answer to a customer\'s question? (Select all that apply)',
      options: [
        'A. Tell the customer you will find out and follow up within a specific timeframe.',
        'B. Make an educated guess and hope it is correct.',
        'C. Ask a colleague or check internal documentation before responding.',
        'D. Apologize and suggest the customer contact another department.',
      ],
    },
    {
      id: 'q8',
      type: 'qcm',
      module: 'Logic & Reasoning',
      question: 'If a team of 4 agents handles 240 tickets per day and one agent is on leave, how many tickets per agent per day should the remaining team handle to maintain throughput?',
      options: ['A. 60', 'B. 70', 'C. 80', 'D. 90'],
    },
    {
      id: 'q9',
      type: 'shorttext',
      module: 'Job Skills',
      question: 'Describe a situation where you turned a negative customer experience into a positive one. What did you do and what was the outcome?',
      wordLimit: 150,
    },
    {
      id: 'q10',
      type: 'dragdrop',
      module: 'Trust & Consistency',
      question: 'Rank the following de-escalation techniques from most effective (1) to least effective (4):',
      items: [
        'Acknowledge the customer\'s feelings first',
        'Offer a concrete solution immediately',
        'Explain company policy clearly',
        'Transfer to a supervisor',
      ],
    },
    {
      id: 'q11',
      type: 'casestudy',
      module: 'Job Skills',
      question: 'Read the scenario and answer the questions.',
      scenario: 'You are handling live chat and have three concurrent conversations: a VIP client with a billing issue, a new customer who cannot complete registration, and a frustrated user threatening a social media post.',
      subQuestions: [
        'How do you prioritize these three conversations?',
        'What do you say to the user threatening a social media post?',
        'How do you ensure quality across all three simultaneously?',
      ],
    },
    {
      id: 'q12',
      type: 'shorttext',
      module: 'Communication',
      question: 'This is the final question. Write a professional closing message to a customer whose issue has been resolved.',
      wordLimit: 150,
    },
  ],
}
