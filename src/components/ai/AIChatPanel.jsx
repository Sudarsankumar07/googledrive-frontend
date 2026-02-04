import { useEffect, useMemo, useRef } from 'react';
import { Sparkles, X, Send, Trash2 } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useFiles } from '../../context/FileContext';
import Button from '../common/Button';
import AIChatMessage from './AIChatMessage';

const AIChatPanel = () => {
  const {
    isChatOpen,
    closeChat,
    clearChat,
    messages,
    draftMessage,
    setDraftMessage,
    isSending,
    sendMessage,
    chatContext,
  } = useAI();
  const { currentFolder } = useFiles();
  const listRef = useRef(null);

  useEffect(() => {
    if (!isChatOpen) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [isChatOpen, messages]);

  const selectedCount = useMemo(
    () => (Array.isArray(chatContext?.selectedFiles) ? chatContext.selectedFiles.length : 0),
    [chatContext]
  );

  const handleSend = async () => {
    await sendMessage(draftMessage, { currentFolder: currentFolder?._id || null });
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={closeChat}
        aria-label="Close AI chat"
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-dark-900 border-l border-gray-200 dark:border-dark-800 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">CloudDrive AI</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedCount > 0 ? `Focused on ${selectedCount} file${selectedCount > 1 ? 's' : ''}` : 'Ask about your files'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearChat}
              className="btn-ghost p-2 rounded-xl"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={closeChat}
              className="btn-ghost p-2 rounded-xl"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-dark-950">
          {messages.length === 0 ? (
            <div className="card p-4">
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium mb-2">
                Try asking:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Summarize my latest file',
                  'Find files about invoices',
                  'What files mention budget?',
                  'Show me documents I uploaded this week',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDraftMessage(t)}
                    className="px-3 py-1.5 text-xs rounded-full bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => <AIChatMessage key={m.id} message={m} />)
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-dark-800">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about your files…"
              className="input resize-none min-h-[44px] max-h-32"
            />
            <Button
              onClick={handleSend}
              disabled={!draftMessage.trim() || isSending}
              icon={Send}
              className="h-[44px]"
            >
              Send
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
