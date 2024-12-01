"use client"

import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MarkdownLiveEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Welcome to Markdown Live Editor

## Features
- Real-time markdown preview
- Syntax highlighting
- GitHub Flavored Markdown
- Code block support

\`\`\`typescript
// Example TypeScript Code
const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Formatting
- **Bold text**
- *Italic text*
- ~~Strikethrough~~

> Blockquote example

[Link to Anthropic](https://www.anthropic.com)`);

  const handleMarkdownChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-gray-50">
      <div className="w-1/2 bg-slate-200 shadow-lg h-full">
        <textarea
          className="w-full h-full p-4 border-none outline-none resize-none font-mono text-sm text-gray-950"
          value={markdown}
          onChange={handleMarkdownChange}
          placeholder="Write your markdown here..."
        />
      </div>

      <div className="w-1/2 p-4 overflow-auto bg-gray-50">
        <div className="prose max-w-none prose-pre:p-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={materialDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-800 border-b-2 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-gray-700 border-b-1 pb-1">
                  {children}
                </h2>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownLiveEditor;