'use client'
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
  onRowClick?: (rowData: any) => void; // Function to handle row clicks
}

export default function MarkdownView({ content, onRowClick }: MarkdownViewProps) {
  const formatMarkdownContent = (content: string): string => {
    // Step 1: Replace `-` with `*` for list items
    let formattedContent = content.replace(/^- /gm, '* ');
    // Step 2: Remove extra blank lines between list items
    formattedContent = formattedContent.replace(/\n{2,}(\*|\d+\.)/g, '\n$1');
    return formattedContent;
  };

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    if (onRowClick) {
      const tdElements = Array.from(event.currentTarget.getElementsByTagName('td'));
      const rowData = tdElements.map((td) => td.textContent?.trim());
      onRowClick(rowData);
    }
  };

  return (
    <div className="relative w-full flex flex-col mt-4 rounded-md text-left">
      <div className="markdown-container">
        <ReactMarkdown
          children={formatMarkdownContent(content)}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="leading-relaxed mb-6" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-6" {...props} />,
            li: ({ node, ...props }) => <li className="mb-3" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-2xl md:text-2xl font-extrabold mb-6 mt-8" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg md:text-xl font-semibold mb-4 mt-6" {...props} />,
            h3: ({ node, ...props }) => <h3 className="md:text-lg font-semibold mb-2 mt-4" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-600 pl-4 italic mb-4" {...props} />,
            table: ({ node, ...props }) => (
              <table className="table-auto border-collapse border border-gray-300 w-full mb-6 text-sm md:text-base" {...props} />
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-sm" {...props} />
            ),
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, ...props }) => (
              <tr
                className={`border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-all duration-200`} 
                onClick={handleRowClick}
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
              className="border border-gray-300 px-4 py-3 text-left font-bold bg-gray-100"
              title="Click to sort"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="border border-gray-300 px-4 py-3 text-gray-600"
                {...props}
              />
            ),
          }}
        />
      </div>
    </div>
  );
}
