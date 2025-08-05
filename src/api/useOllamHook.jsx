import { useState } from 'react';

export default function useOllamaHook() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (prompt) => {
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: prompt,
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Error en la respuesta del servidor');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              setResponse(prev => prev + parsed.response);
            }
          } catch (err) {
            console.error('Error parsing JSON:', err);
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, response, error, loading };
}

