import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { fetchHistory, sendMessage } from '../lib/api';
import { useAppContext } from '../store/AppContext';
import type { ChatMessage, PersonaId } from '../types';

export default function ChatView() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { personas, activePersonaId, activePersona, setActivePersonaId, refreshSessions } =
    useAppContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(Boolean(sessionId));
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewedPersonaId, setViewedPersonaId] = useState<PersonaId>(activePersonaId);

  // New chat (no sessionId in the URL): show the active persona's greeting.
  useEffect(() => {
    if (sessionId) return;
    setViewedPersonaId(activePersonaId);
    setMessages([{ role: 'assistant', content: activePersona.greeting }]);
    setError(null);
  }, [sessionId, activePersonaId, activePersona.greeting]);

  // Existing session: load its history + persona from the server.
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setLoadingHistory(true);
    setError(null);

    fetchHistory(sessionId)
      .then((result) => {
        if (cancelled) return;
        setMessages(result.messages);
        setViewedPersonaId(result.personaId);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load this conversation');
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const persona = personas.find((p) => p.id === viewedPersonaId) ?? activePersona;

  async function handleSend(text: string): Promise<void> {
    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text, createdAt: new Date().toISOString() }];
    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const { reply, sessionId: newSessionId } = await sendMessage({
        message: text,
        personaId: persona.id,
        sessionId: sessionId ?? null,
      });
      setMessages([...nextMessages, { role: 'assistant', content: reply, createdAt: new Date().toISOString() }]);
      refreshSessions();
      if (!sessionId) {
        navigate(`/chat/${newSessionId}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsTyping(false);
    }
  }

  function handleSwitchPersona(id: PersonaId): void {
    setActivePersonaId(id);
    navigate('/');
  }

  function handleReset(): void {
    navigate('/');
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <ChatHeader
        persona={persona}
        personas={personas}
        onSwitchPersona={handleSwitchPersona}
        onReset={handleReset}
        // messages={messages}
        onMenuToggle={toggleSidebar}
      />
      {loadingHistory ? (
        <div className="flex-1 flex items-center justify-center bg-surface">
          <span className="text-[12.5px] text-ink-quiet">Loading conversation…</span>
        </div>
      ) : (
        <ChatWindow messages={messages} persona={persona} isTyping={isTyping} />
      )}
      {error && <p className="px-4 py-1.5 text-[12px] text-red-600 bg-red-50 border-t border-red-100">{error}</p>}
      <ChatInput
        onSend={handleSend}
        disabled={isTyping || loadingHistory}
        persona={persona}
        personas={personas}
        onSwitchPersona={handleSwitchPersona}
      />
    </div>
  );
}
