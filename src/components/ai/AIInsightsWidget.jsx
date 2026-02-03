import { useEffect, useState } from 'react';
import { Sparkles, Tag } from 'lucide-react';
import aiService from '../../services/aiService';
import { useAI } from '../../context/AIContext';

const AIInsightsWidget = () => {
  const { openChat } = useAI();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await aiService.getInsights();
        if (isActive && response?.success) {
          setInsights(response.data);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">AI Insights</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {insights?.aiConfigured ? 'Groq connected' : 'Groq not configured'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => openChat()}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Open chat
        </button>
      </div>

      {loading ? (
        <div className="mt-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3" />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">AI processed files</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {insights?.aiProcessedFiles ?? 0} / {insights?.totalFiles ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Stale files (6+ months)</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {insights?.staleFiles ?? 0}
            </span>
          </div>

          {Array.isArray(insights?.topTags) && insights.topTags.length > 0 && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                Top AI tags
              </div>
              <div className="flex flex-wrap gap-1">
                {insights.topTags.slice(0, 8).map((t) => (
                  <span
                    key={t.tag}
                    className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200"
                    title={`${t.count} files`}
                  >
                    {t.tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!insights?.aiConfigured && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Set `GROQ_API_KEY` in backend `.env` to enable real AI responses.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsightsWidget;

