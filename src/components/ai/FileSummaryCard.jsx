import { Sparkles, Tag } from 'lucide-react';
import Button from '../common/Button';

const FileSummaryCard = ({
  summary,
  keyPoints = [],
  tags = [],
  loading = false,
  onGenerate,
  onAskAI,
  className = '',
}) => {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <div className="font-semibold text-gray-900 dark:text-white">AI Summary</div>
        </div>
        <div className="flex items-center gap-2">
          {onAskAI && (
            <Button variant="secondary" size="sm" onClick={onAskAI}>
              Ask AI
            </Button>
          )}
          {onGenerate && (
            <Button variant="primary" size="sm" onClick={onGenerate} loading={loading}>
              {summary ? 'Regenerate' : 'Generate'}
            </Button>
          )}
        </div>
      </div>

      {summary ? (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {summary}
          </p>

          {Array.isArray(keyPoints) && keyPoints.length > 0 && (
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {keyPoints.slice(0, 6).map((p, idx) => (
                <li key={`${idx}-${p}`}>{p}</li>
              ))}
            </ul>
          )}

          {Array.isArray(tags) && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.slice(0, 10).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200"
                >
                  <Tag className="w-3 h-3 text-gray-400" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Generate a quick summary and tags for this file.
        </div>
      )}
    </div>
  );
};

export default FileSummaryCard;

