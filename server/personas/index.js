const { HITESH_SYSTEM_PROMPT } = require('./hitesh');
const { PIYUSH_SYSTEM_PROMPT } = require('./piyush');

const PERSONAS = {
  hitesh: {
    id: 'hitesh',
    displayName: 'Hitesh',
    tagline: 'Chai, code, aur thoda sa gyaan',
    color: '#c9762c',
    systemPrompt: HITESH_SYSTEM_PROMPT,
    temperature: 0.85,
    greeting:
      "Haanji! Main hoon Hitesh persona — batao, aaj kya seekhna/banana hai?",
  },
  piyush: {
    id: 'piyush',
    displayName: 'Piyush',
    tagline: 'Backend, system design, ship it',
    color: '#2c6fc9',
    systemPrompt: PIYUSH_SYSTEM_PROMPT,
    temperature: 0.75,
    greeting:
      "Chalo bhai, seedha shuru karte hain — kis system ya project pe kaam chal raha hai?",
  },
};

function getPersona(id) {
  return PERSONAS[id] || null;
}

function listPersonas() {
  return Object.values(PERSONAS).map(({ id, displayName, tagline, color, greeting }) => ({
    id,
    displayName,
    tagline,
    color,
    greeting,
  }));
}

module.exports = { PERSONAS, getPersona, listPersonas };
