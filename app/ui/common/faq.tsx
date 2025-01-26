'use client'
import React, { useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Faq({faqData}: {
  faqData: {question: string, answer: string[]}
}){
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };
  

  return (
    <section id='faq' className='mx-auto w-full  py-16 mb-16'>
    <div className="max-w-7xl mx-auto flex flex-col gap-12">
      <div className="flex flex-col text-center basis-1/2">
        <h1 className="ttext-center text-3xl mb-4 px-3 font-bold">
          Frequently Asked Questions
        </h1>
       
      </div>
      <ul className="basis-1/2 rounded-md p-4">
        {faqData.map((item, index) => (
          <li key={index}>
            <button
              className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
              aria-expanded={expandedIndex === index}
              onClick={() => handleToggle(index)}
            >
              <span className="flex-1 text-base-content">{item.question}</span>
              <FontAwesomeIcon
                icon={expandedIndex === index ? faChevronUp : faChevronDown}
                className="w-4 h-4 ml-auto text-base-content"
              />
            </button>
            <div
              className="transition-all duration-300 ease-in-out opacity-80 overflow-hidden"
              style={{
                maxHeight: expandedIndex === index ? '100%' : '0',
                opacity: expandedIndex === index ? '1' : '0',
              }}
            >
              <div className="pb-5 leading-relaxed">
                {item.answer.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
  );
};
