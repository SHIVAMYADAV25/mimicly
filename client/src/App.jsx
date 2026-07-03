import { useEffect, useState, useCallback } from 'react';
import PersonaSwitcher from './components/PersonaSwitcher';
import PersonaHeader from './components/PersonaHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { fetchPersonas, sendMessage } from './lib/api';

const FALLBACK_PERSONAS = [
  {
    id: 'hitesh',
    displayName: 'Hitesh',
    tagline: 'Chai, code, aur thoda sa gyaan',
    color: '#c9762c',
    greeting: 'Haanji! Batao, aaj kya seekhna/banana hai?',
  },
  {
    id: 'piyush',
    displayName: 'Piyush',
    tagline: 'Backend, system design, ship it',
    color: '#3d7fd6',
    greeting: 'Chalo bhai, seedha shuru karte hain — kis project pe kaam chal raha hai?',
  },
];

const STORAGE_KEY = 'persona-ai-state-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export default function App() {
  const [personas, setPersonas] = useState(FALLBACK_PERSONAS);
  const [activeId, setActiveId] = useState('hitesh');
  const [chats, setChats] = useState({}); // { [personaId]: { sessionId, messages: [] } }
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonas()
      .then((list) => list.length && setPersonas(list))
      .catch(() => {
        /* fall back to bundled persona metadata */
      });
  }, []);

  useEffect(() => {
    const stored = loadState();
    const initial = {};
    for (const p of personas) {
      initial[p.id] = stored[p.id] || {
        sessionId: null,
        messages: [{ role: 'assistant', content: p.greeting }],
      };
    }
    setChats(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas.length]);

  const persona = personas.find((p) => p.id === activeId) || personas[0];
  const activeChat = chats[activeId] || { sessionId: null, messages: [] };

  const persist = useCallback((next) => {
    setChats(next);
    saveState(next);
  }, []);

  async function handleSend(text) {
    setError(null);
    const withUserMsg = {
      ...chats,
      [activeId]: {
        ...activeChat,
        messages: [...activeChat.messages, { role: 'user', content: text }],
      },
    };
    persist(withUserMsg);
    setIsTyping(true);

    try {
      const { reply, sessionId } = await sendMessage({
        message: text,
        personaId: activeId,
        sessionId: activeChat.sessionId,
      });
      const withReply = {
        ...withUserMsg,
        [activeId]: {
          sessionId,
          messages: [...withUserMsg[activeId].messages, { role: 'assistant', content: reply }],
        },
      };
      persist(withReply);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsTyping(false);
    }
  }

  function handleReset() {
    const next = {
      ...chats,
      [activeId]: {
        sessionId: null,
        messages: [{ role: 'assistant', content: persona.greeting }],
      },
    };
    persist(next);
  }

  if (!persona) return null;

  return (
    <div className="h-full flex items-center justify-center p-3 md:p-6">
      <div className="w-full max-w-2xl h-full md:h-[85vh] flex flex-col rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-ink">
        <div className="px-4 pt-4">
          <p className="font-mono text-[11px] text-parchment/30 mb-1">persona-ai / GenAI with JS 2026</p>
        </div>
        <PersonaSwitcher personas={personas} activeId={activeId} onSwitch={setActiveId} />
        <PersonaHeader persona={persona} onReset={handleReset} />
        <ChatWindow messages={activeChat.messages} persona={persona} isTyping={isTyping} />
        {error && (
          <p className="px-4 py-1 text-[11px] font-mono text-red-400/80">{error}</p>
        )}
        <ChatInput onSend={handleSend} disabled={isTyping} persona={persona} />
      </div>
    </div>
  );
}
