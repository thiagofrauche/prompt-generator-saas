'use client';
import { useState } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';

/**
 * Este é um gerador simples, só pra funcionar imediatamente.
 * Dica: Substitua este componente pelo GERADOR COMPLETO que está no canvas (copie e cole).
 */
export default function GeneratorPlaceholder() {
  const [desc, setDesc] = useState('Tênis de corrida preto com detalhes vermelhos...');
  const [platform, setPlatform] = useState('Shopee');
  const [size, setSize] = useState('1024x1024');
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  function build() {
    const p = [
      `Tarefa: gerar imagem para produto na plataforma ${platform}.`,
      `Conteúdo: ${desc}.`,
      `Formato final: ${size}.`,
      `Regras: fundo limpo, produto centralizado, sem marcas d'água.`,
    ].join('\n');
    setPrompt(p);
  }
  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(()=>setCopied(false), 1200);
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Descrição</label>
          <textarea className="w-full border rounded-xl px-3 py-2 min-h-[100px]" value={desc} onChange={e=>setDesc(e.target.value)} />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Plataforma</label>
            <select className="w-full border rounded-xl px-3 py-2" value={platform} onChange={e=>setPlatform(e.target.value)}>
              <option>Shopee</option>
              <option>Mercado Livre</option>
              <option>Instagram</option>
              <option>TikTok Shop</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Tamanho</label>
            <input className="w-full border rounded-xl px-3 py-2" value={size} onChange={e=>setSize(e.target.value)} placeholder="ex.: 1080x1350" />
          </div>
          <button onClick={build} className="w-full border rounded-xl px-3 py-2 hover:bg-zinc-50">Gerar prompt</button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium">Prompt final</div>
          <button onClick={copy} className="inline-flex items-center gap-2 border rounded-xl px-3 py-1 text-sm">
            {copied ? <Check className="w-4 h-4"/> : <ClipboardCopy className="w-4 h-4"/>}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <pre className="bg-white border rounded-xl p-3 min-h-[120px] whitespace-pre-wrap">{prompt}</pre>
        <p className="text-xs text-zinc-600 mt-2">Substitua este componente pelo gerador completo do canvas para ter todos os recursos.</p>
      </div>
    </div>
  );
}
