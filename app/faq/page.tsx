// components/FAQPage.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { FAQCollection } from '../../public/index';
import { ContentSection } from '../../components/shared/content-section';

interface Props {
  className?: string;
}

export const FAQPage: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      <ContentSection 
        title="Часто задаваемые вопросы"
        iconSrc="/icons/faq-icon.gif"
        iconAlt="FAQ"
        className="flex-grow"
      >
        <div className="bg-slate-900 rounded-lg shadow-xl p-6">
          <ul className="flex flex-col gap-8">
            {FAQCollection.map((section, index) => (
              <li key={index} className="border-b border-slate-700 pb-6 last:border-0 last:pb-0">
                <h2 className="text-xl text-orange-400 font-bold mb-4">{section.title}</h2>
                <ul className="space-y-6">
                  {section.faqs.map((faq, faqIndex) => (
                    <li key={faqIndex} className="bg-slate-800 rounded-md p-4 hover:bg-slate-700 transition-colors">
                      {faq.question && (
                        <div className="text-white font-bold mb-2">{faq.question}</div>
                      )}
                      <div className="text-slate-300">{faq.answer}</div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </ContentSection>
    </div>
  );
};

export default FAQPage;