import React, { useState } from 'react';
import {
  Bookmark,
  Copy,
  Check,
  Plus,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const IdeaCard = ({
  idea,
  onToggleFavorite,
  onAddTaskFromIdea,
  isAdded = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${idea.title}\n\n${idea.description}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCostImpactBadge = (impact) => {
    switch (impact) {
      case 'Budget-friendly':
        return <Badge variant="success" size="xs">₹ Budget-Conscious</Badge>;
      case 'Moderate':
        return <Badge variant="neutral" size="xs">₹₹ Moderate Investment</Badge>;
      case 'Premium':
        return <Badge variant="blush" size="xs">₹₹₹ Signature Tier</Badge>;
      default:
        return <Badge variant="neutral" size="xs">{impact}</Badge>;
    }
  };

  return (
    <Card className="p-6 flex flex-col justify-between text-left hover:border-sage-300 transition-all bg-white">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-800 bg-sage-50 px-2.5 py-0.5 rounded-md border border-sage-200/60">
              {idea.tag || idea.type}
            </span>
            <h4 className="font-editorial text-xl text-charcoal font-medium mt-2">
              {idea.title}
            </h4>
          </div>

          <button
            onClick={() => onToggleFavorite(idea.id)}
            className={`p-1.5 rounded-xl transition-all ${
              idea.favorite
                ? 'bg-sage-100 text-sage-900'
                : 'text-muted hover:text-charcoal hover:bg-ivory'
            }`}
            title={idea.favorite ? 'Saved to favorites' : 'Save to favorites'}
          >
            <Bookmark
              className={`w-4 h-4 ${idea.favorite ? 'fill-sage-800 text-sage-800' : ''}`}
            />
          </button>
        </div>

        <p className="text-sm text-muted leading-relaxed mb-6">
          {idea.description}
        </p>
      </div>

      <div className="pt-4 border-t border-stoneborder flex flex-wrap items-center justify-between gap-2">
        <div>{getCostImpactBadge(idea.costImpact)}</div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg text-muted hover:text-charcoal hover:bg-ivory transition-colors border border-transparent hover:border-stoneborder"
            title="Copy concept"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-sage-700" />
                <span className="text-sage-800">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {onAddTaskFromIdea && (
            <button
              onClick={() => onAddTaskFromIdea(idea)}
              disabled={isAdded}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isAdded
                  ? 'bg-sage-100 text-sage-900 border border-sage-300/80 cursor-default font-semibold'
                  : 'text-sage-900 bg-sage-100/70 hover:bg-sage-200/80'
              }`}
              title={isAdded ? 'Already added to timeline' : 'Add to Event Deliverables'}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-sage-700" />
                  <span>In Plan</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
