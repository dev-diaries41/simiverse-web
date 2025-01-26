import { Settings } from "@/app/types";

export const AcceptedMimes = [
    'text/csv',
    'application/json',
    'application/pdf',
    'text/markdown',
    'text/x-markdown'
  ]

export const AcceptedImgMimes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
  ]

export const AcceptedDocFiles = [
  '.json', 
  '.csv', 
  '.md'
]
export const AcceptedImgFiles = [
  '.png', 
  '.jpg', 
  '.jpeg'
]

export const Time = {
  sec: 1000,
  min: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000
} as const;


export const StorageKeys = {
  settings: 'settings',
  encrypt: 'encrypt',
}


export const DefaultSettings:Settings  = {
  environment: {
    name: 'Environment',
    theme: 'System',
    showCode: false,
    language: 'Auto-detect',
  },

  simulationOptions: {
    name: 'Simulation',
    type:"sim",
    steps: 10,
    openaiApiKey: ""
  }
};

