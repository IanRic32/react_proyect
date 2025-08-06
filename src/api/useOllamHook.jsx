import { useState, useCallback } from 'react';


export default function useOllamaHook() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (prompt) => {
    console.log('handleSubmit called with prompt:', prompt);
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: prompt,
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      if (!res.body) {
        throw new Error('No se recibió un cuerpo de respuesta');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullResponse = '';

      const processChunk = (chunk) => {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const parsed = JSON.parse(line);
            
            if (parsed.done) {
              console.log('🟢 Fin de generación');
              return true; 
            }
            
            if (parsed.response) {
              fullResponse += parsed.response;
              setResponse(fullResponse);
            }
          } catch (err) {
            console.error('Error parsing JSON:', err, 'Line:', line);
            
          }
        }
        return false;
      };

      let isDone = false;
      while (!isDone) {
        const { value, done } = await reader.read();
        if (done) break;
        isDone = processChunk(value);
      }

      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer);
          if (parsed.response) {
            setResponse(prev => prev + parsed.response);
          }
        } catch (err) {
          console.error('Error parsing final buffer:', err);
        }
      }

    } catch (err) {
      console.error("Error en useOllamaHook:", err);
      setError(err.message || 'Error al comunicarse con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleSubmit, response, error, loading };
}