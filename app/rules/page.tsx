// components/RulesPage.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { RulesCollection } from '../../public/index';
import { ContentSection } from '../../components/shared/content-section';

interface Props {
  className?: string;
}

export const RulesPage: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      <ContentSection 
        title="Правила сервера"
        iconSrc="/icons/rules-icon.gif"
        iconAlt="Rules"
        className="flex-grow"
      >
        <div className="bg-slate-900 rounded-lg shadow-xl p-6">
          {RulesCollection.reduce((sections, item) => {
            if (item.title) {
              sections.push({
                title: item.title,
                rules: []
              });
            } else if (sections.length > 0) {
              sections[sections.length - 1].rules.push(item.rule);
            }
            return sections;
          }, [] as {title: string, rules: string[]}[]).map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8 last:mb-0 border-b border-slate-700 pb-6 last:border-0 last:pb-0">
              <h2 className="text-xl text-orange-400 font-bold mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex} className="bg-slate-800 rounded-md p-3 hover:bg-slate-700 transition-colors text-slate-300">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>
    </div>
  );
};

export default RulesPage;