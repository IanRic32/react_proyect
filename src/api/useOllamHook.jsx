import { useState } from 'react';

export default function useOllamaHook() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (_prompt) => {
    console.log('handleSubmit called with prompt:', _prompt);
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const pingResponse = await fetch('http://localhost:11434');
      if (!pingResponse.ok) {
        throw new Error('Ollama server not running or not reachable');
      }
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: _prompt,
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }


      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {break};

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; 

        for (const line of lines) {
          if (!line.trim()) {continue};

          try {
            const parsed = JSON.parse(line);
            if (parsed.done) {
              console.log('🟢 FIN DE GENERACIÓN');
              break;
            }
            if (parsed.response) {
              fullResponse += parsed.response;
              setResponse(fullResponse);
            }
          } catch (err) {
            console.warn('❗ Error parseando línea JSON', err, line);
          }
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error al hacer la petición:', err);
      setError(err.message || 'Error al conectar con el servidor');
      setLoading(false);
    }
  };

  return { handleSubmit, response, error, loading };
}
