import { HITESH_SYSTEM_PROMPT } from './hitesh';
import { PIYUSH_SYSTEM_PROMPT } from './piyush';
import type { PersonaConfig, PersonaId, PersonaListItem } from '../types';

export const PERSONAS: Record<PersonaId, PersonaConfig> = {
  hitesh: {
    id: 'hitesh',
    displayName: 'Hitesh',
    tagline: 'Chai, code, aur thoda sa gyaan',
    color: '#c9762c',
    systemPrompt: HITESH_SYSTEM_PROMPT,
    temperature: 0.85,
    greeting: 'Haanji! Main hoon Hitesh persona — batao, aaj kya seekhna/banana hai?',
  },
  piyush: {
    id: 'piyush',
    displayName: 'Piyush',
    tagline: 'Backend, system design, ship it',
    color: '#2c6fc9',
    systemPrompt: PIYUSH_SYSTEM_PROMPT,
    temperature: 0.75,
    greeting: 'Chalo bhai, seedha shuru karte hain — kis system ya project pe kaam chal raha hai?',
  },
};

export function getPersona(id: string): PersonaConfig | null {
  return (PERSONAS as Record<string, PersonaConfig>)[id] ?? null;
}

export function listPersonas(): PersonaListItem[] {
  return Object.values(PERSONAS).map(
    ({ id, displayName, tagline, color, greeting }): PersonaListItem => ({
      id,
      displayName,
      tagline,
      color,
      greeting,
    })
  );
}
