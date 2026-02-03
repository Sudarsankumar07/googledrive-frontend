import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import aiService from '../services/aiService';

const AIContext = createContext(null);

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const AIProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatContext, setChatContext] = useState({ selectedFiles: [] });

  const openChat = useCallback((options = {}) => {
    setIsChatOpen(true);
    if (typeof options.prefill === 'string') {
      setDraftMessage(options.prefill);
    }
    if (options.context && typeof options.context === 'object') {
      setChatContext((prev) => ({ ...prev, ...options.context }));
    }
  }, []);

  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const toggleChat = useCallback(() => setIsChatOpen((prev) => !prev), []);
  const clearChat = useCallback(() => setMessages([]), []);

  const sendMessage = useCallback(
    async (message, contextOverrides = {}) => {
      const content = String(message ?? draftMessage).trim();
      if (!content || isSending) return;

      const userMessage = {
        id: createId(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setDraftMessage('');
      setIsSending(true);

      try {
        const response = await aiService.chat({
          message: content,
          context: { ...chatContext, ...contextOverrides },
        });

        if (response?.success) {
          const assistantMessage = {
            id: createId(),
            role: 'assistant',
            content: response?.data?.response || '',
            relatedFiles: response?.data?.relatedFiles || [],
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          toast.error(response?.message || 'AI request failed');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'AI request failed');
      } finally {
        setIsSending(false);
      }
    },
    [chatContext, draftMessage, isSending]
  );

  const value = useMemo(
    () => ({
      isChatOpen,
      openChat,
      closeChat,
      toggleChat,
      clearChat,
      messages,
      draftMessage,
      setDraftMessage,
      isSending,
      sendMessage,
      chatContext,
      setChatContext,
    }),
    [
      isChatOpen,
      openChat,
      closeChat,
      toggleChat,
      clearChat,
      messages,
      draftMessage,
      isSending,
      sendMessage,
      chatContext,
    ]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export default AIContext;

