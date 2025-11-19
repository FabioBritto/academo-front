import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface DescriptionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (markdown: string) => void;
  initialValue?: string;
}

export function DescriptionEditorModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialValue = '' 
}: DescriptionEditorModalProps) {
  const [markdown, setMarkdown] = useState(initialValue);
  const [activeListMode, setActiveListMode] = useState<'ul' | 'ol' | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMarkdown(initialValue);
      setActiveListMode(null);
    }
  }, [isOpen, initialValue]);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const beforeText = markdown.substring(0, start);
    const afterText = markdown.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    setMarkdown(newText);

    // Restaurar posição do cursor
    setTimeout(() => {
      textarea.focus();
      let newPosition: number;
      if (selectedText) {
        // Se há texto selecionado, posicionar depois do texto formatado
        newPosition = start + before.length + selectedText.length + after.length;
      } else {
        // Se não há texto selecionado, posicionar entre os marcadores
        newPosition = start + before.length;
      }
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const applyFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const beforeText = markdown.substring(0, start);
    const afterText = markdown.substring(end);

    switch (format) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'underline':
        // Markdown não tem underline nativo, usaremos HTML ou estilo customizado
        // Por enquanto, vamos usar <u> que pode ser renderizado
        insertText('<u>', '</u>');
        break;
      case 'h1':
        if (selectedText) {
          // Se há texto selecionado, transformar em título
          const newText = beforeText + '# ' + selectedText + afterText;
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = start + 2 + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        } else {
          // Se não há seleção, adicionar no início da linha
          const lineStart = beforeText.lastIndexOf('\n') + 1;
          const lineText = markdown.substring(lineStart, start);
          const newText = markdown.substring(0, lineStart) + '# ' + lineText + markdown.substring(start);
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = lineStart + 2 + lineText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        }
        break;
      case 'h2':
        if (selectedText) {
          const newText = beforeText + '## ' + selectedText + afterText;
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = start + 3 + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        } else {
          const lineStart = beforeText.lastIndexOf('\n') + 1;
          const lineText = markdown.substring(lineStart, start);
          const newText = markdown.substring(0, lineStart) + '## ' + lineText + markdown.substring(start);
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = lineStart + 3 + lineText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        }
        break;
      case 'h3':
        if (selectedText) {
          const newText = beforeText + '### ' + selectedText + afterText;
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = start + 4 + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        } else {
          const lineStart = beforeText.lastIndexOf('\n') + 1;
          const lineText = markdown.substring(lineStart, start);
          const newText = markdown.substring(0, lineStart) + '### ' + lineText + markdown.substring(start);
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = lineStart + 4 + lineText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        }
        break;
      case 'ul':
        setActiveListMode('ul');
        if (selectedText) {
          const lines = selectedText.split('\n');
          const formatted = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            // Remover formatação de lista existente
            const cleaned = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
            return `- ${cleaned}`;
          }).join('\n');
          const newText = beforeText + formatted + afterText;
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = start + formatted.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        } else {
          const lineStart = beforeText.lastIndexOf('\n') + 1;
          const lineText = markdown.substring(lineStart, start);
          const newText = markdown.substring(0, lineStart) + '- ' + lineText + markdown.substring(start);
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = lineStart + 2 + lineText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        }
        break;
      case 'ol':
        setActiveListMode('ol');
        if (selectedText) {
          const lines = selectedText.split('\n').filter(line => line.trim());
          const formatted = lines.map((line, index) => {
            const trimmed = line.trim();
            // Remover formatação de lista existente
            const cleaned = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
            return `${index + 1}. ${cleaned}`;
          }).join('\n');
          const newText = beforeText + formatted + afterText;
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = start + formatted.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        } else {
          const lineStart = beforeText.lastIndexOf('\n') + 1;
          const lineText = markdown.substring(lineStart, start);
          const newText = markdown.substring(0, lineStart) + '1. ' + lineText + markdown.substring(start);
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = lineStart + 3 + lineText.length;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
        }
        break;
    }
  };

  const handleSave = () => {
    onSave(markdown);
    onClose();
  };

  const handleClose = () => {
    setMarkdown(initialValue);
    setActiveListMode(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && activeListMode) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const beforeText = markdown.substring(0, start);
      const afterText = markdown.substring(start);
      
      // Encontrar a linha atual
      const lineStart = beforeText.lastIndexOf('\n') + 1;
      const currentLine = markdown.substring(lineStart, start);
      const trimmedLine = currentLine.trim();

      // Verificar se a linha atual está vazia ou só tem o marcador de lista
      const isEmptyListLine = !trimmedLine || 
                              trimmedLine === '-' || 
                              trimmedLine === '- ' || 
                              /^\d+\.\s*$/.test(trimmedLine);
      
      if (isEmptyListLine) {
        // Se a linha está vazia, verificar a linha anterior
        const prevLineEnd = beforeText.lastIndexOf('\n', lineStart - 1);
        const prevLineStart = prevLineEnd >= 0 ? prevLineEnd + 1 : 0;
        const prevLine = markdown.substring(prevLineStart, lineStart).trim();
        const prevLineIsEmpty = !prevLine || 
                                prevLine === '-' || 
                                prevLine === '- ' || 
                                /^\d+\.\s*$/.test(prevLine);

        if (prevLineIsEmpty) {
          // Duas linhas vazias consecutivas = sair do modo lista
          setActiveListMode(null);
          // Remover a linha vazia da lista e adicionar uma linha vazia normal
          const newText = markdown.substring(0, lineStart) + '\n' + afterText;
          setMarkdown(newText);
          setTimeout(() => {
            textarea.focus();
            const newPosition = lineStart + 1;
            textarea.setSelectionRange(newPosition, newPosition);
          }, 0);
          return;
        }
        
        // Se apenas a linha atual está vazia, substituir ela pelo novo item
        // Calcular o próximo item
        let nextItem = '';
        if (activeListMode === 'ul') {
          nextItem = '- ';
        } else if (activeListMode === 'ol') {
          // Encontrar o próximo número da lista olhando as linhas anteriores
          let nextNumber = 1;
          const lines = markdown.substring(0, prevLineStart).split('\n');
          for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.match(/^\d+\.\s/)) {
              const match = line.match(/^(\d+)\.\s/);
              if (match) {
                nextNumber = parseInt(match[1]) + 1;
                break;
              }
            } else if (line && !line.startsWith('- ') && !line.match(/^\d+\.\s/)) {
              // Se encontrou uma linha que não é lista, usar 1
              break;
            }
          }
          nextItem = `${nextNumber}. `;
        }
        
        // Substituir a linha vazia atual pelo novo item
        const newText = markdown.substring(0, lineStart) + nextItem + afterText;
        setMarkdown(newText);
        setTimeout(() => {
          textarea.focus();
          const newPosition = lineStart + nextItem.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
        return;
      }

      // Continuar a lista (linha atual tem conteúdo)
      let nextItem = '';
      if (activeListMode === 'ul') {
        nextItem = '- ';
      } else if (activeListMode === 'ol') {
        // Encontrar o número da linha atual primeiro
        let currentNumber = 1;
        const currentLineMatch = trimmedLine.match(/^(\d+)\.\s/);
        if (currentLineMatch) {
          currentNumber = parseInt(currentLineMatch[1]);
        } else {
          // Se não encontrou número na linha atual, procurar na última linha válida
          const lines = markdown.substring(0, lineStart).split('\n');
          for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.match(/^\d+\.\s/)) {
              const match = line.match(/^(\d+)\.\s/);
              if (match) {
                currentNumber = parseInt(match[1]);
                break;
              }
            } else if (line && !line.startsWith('- ') && !line.match(/^\d+\.\s/)) {
              // Se encontrou uma linha que não é lista, usar 1
              break;
            }
          }
        }
        // O próximo número é o número atual + 1
        const nextNumber = currentNumber + 1;
        nextItem = `${nextNumber}. `;
      }

      const newText = beforeText + '\n' + nextItem + afterText;
      setMarkdown(newText);
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + 1 + nextItem.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  // Função para renderizar preview do markdown
  const renderPreview = (text: string) => {
    if (!text.trim()) return { __html: '' };

    // Processar linha por linha para manter estrutura
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Títulos
      if (trimmed.startsWith('### ')) {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>';
          inList = false;
          listType = null;
        }
        html += `<h3 class="text-lg font-bold mb-2 mt-3">${trimmed.substring(4)}</h3>`;
      } else if (trimmed.startsWith('## ')) {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>';
          inList = false;
          listType = null;
        }
        html += `<h2 class="text-xl font-bold mb-2 mt-3">${trimmed.substring(3)}</h2>`;
      } else if (trimmed.startsWith('# ')) {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>';
          inList = false;
          listType = null;
        }
        html += `<h1 class="text-2xl font-bold mb-2 mt-3">${trimmed.substring(2)}</h1>`;
      } 
      // Lista com tópicos
      else if (trimmed.startsWith('- ')) {
        if (!inList || listType !== 'ul') {
          if (inList && listType === 'ol') {
            html += '</ol>';
          }
          html += '<ul class="list-disc ml-6 mb-2">';
          inList = true;
          listType = 'ul';
        }
        const content = trimmed.substring(2);
        html += `<li class="mb-1">${formatInlineMarkdown(content)}</li>`;
      }
      // Lista enumerada
      else if (/^\d+\.\s/.test(trimmed)) {
        if (!inList || listType !== 'ol') {
          if (inList && listType === 'ul') {
            html += '</ul>';
          }
          html += '<ol class="list-decimal ml-6 mb-2">';
          inList = true;
          listType = 'ol';
        }
        const content = trimmed.replace(/^\d+\.\s/, '');
        html += `<li class="mb-1">${formatInlineMarkdown(content)}</li>`;
      }
      // Linha vazia
      else if (!trimmed) {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>';
          inList = false;
          listType = null;
        }
        html += '<br>';
      }
      // Texto normal
      else {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>';
          inList = false;
          listType = null;
        }
        html += `<p class="mb-2">${formatInlineMarkdown(trimmed)}</p>`;
      }
    });

    // Fechar lista se ainda estiver aberta
    if (inList) {
      html += listType === 'ol' ? '</ol>' : '</ul>';
    }

    return { __html: html };
  };

  // Função para formatar markdown inline (negrito, itálico, sublinhado)
  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          {/* Header */}
          <div className="bg-academo-brown px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Editor de Descrição
              </h3>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-orange-100 text-sm mt-1">
              Formate sua descrição usando as ferramentas abaixo
            </p>
          </div>

          {/* Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => applyFormat('h1')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Título 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('h2')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Título 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('h3')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Título 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => applyFormat('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Negrito"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Itálico"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('underline')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Sublinhado"
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={() => applyFormat('ul')}
              className={`p-2 rounded transition-colors ${
                activeListMode === 'ul' 
                  ? 'bg-academo-brown text-white hover:bg-academo-sage' 
                  : 'hover:bg-gray-200'
              }`}
              title="Lista com tópicos"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('ol')}
              className={`p-2 rounded transition-colors ${
                activeListMode === 'ol' 
                  ? 'bg-academo-brown text-white hover:bg-academo-sage' 
                  : 'hover:bg-gray-200'
              }`}
              title="Lista enumerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Editor */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Editor (Markdown)
              </label>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => {
                  setMarkdown(e.target.value);
                  // Verificar se saiu do modo lista (linha não é mais lista)
                  if (activeListMode) {
                    const cursorPos = e.target.selectionStart;
                    const beforeText = e.target.value.substring(0, cursorPos);
                    const lineStart = beforeText.lastIndexOf('\n') + 1;
                    const currentLine = e.target.value.substring(lineStart, cursorPos).trim();
                    
                    // Se a linha atual não é mais uma lista, desativar modo lista
                    if (currentLine && !currentLine.startsWith('- ') && !/^\d+\.\s/.test(currentLine)) {
                      setActiveListMode(null);
                    }
                  }
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academo-brown font-mono text-sm resize-none"
                placeholder="Digite sua descrição aqui..."
                rows={15}
              />
            </div>

            {/* Preview */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div 
                className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto text-sm prose prose-sm max-w-none"
                style={{ minHeight: '200px', maxHeight: '400px' }}
                dangerouslySetInnerHTML={renderPreview(markdown)}
              />
              {!markdown && (
                <p className="text-gray-400 italic text-sm mt-2">Preview aparecerá aqui...</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-academo-brown text-white rounded-lg hover:bg-academo-sage transition-colors"
            >
              Salvar Descrição
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

