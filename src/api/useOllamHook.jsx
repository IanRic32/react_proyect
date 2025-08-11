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
      // 1. Primero verificamos si el servidor está disponible
      const pingResponse = await fetch('http://localhost:11434');
      if (!pingResponse.ok) {
        throw new Error('Ollama server not running or not reachable');
      }

      // 2. Hacemos la petición principal con fetch
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

      // 3. Verificamos si la respuesta es válida
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      // 4. Procesamos el stream de respuesta
      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Guardar línea incompleta para el próximo chunk

        for (const line of lines) {
          if (!line.trim()) continue;

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


// import { useState } from 'react';
// import axios from 'axios';

// export default function useOllamaHook() {

//   const [response, setResponse] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (_prompt) => {
//     console.log('handleSubmit called with prompt:', _prompt);
//     setLoading(true);
//     setResponse('');
//     setError(null);

//     try {
//       const response = await axios({
//         method: 'post',
//         url: 'http://localhost:11434/api/generate',
//         data: {
//           model: 'deepseek-r1:1:8b',
//           prompt: _prompt,
//           max_tokens: 500,
//           stream: true,
//         },
//         responseType: 'stream', // Esto es importante para streaming
//       });

//       const stream = response.data;
//       const decoder = new TextDecoder('utf-8');
//       let buffer = '';

//       stream.on('data', (chunk) => {
//         buffer += decoder.decode(chunk, { stream: true });

//         // Procesa líneas completas
//         const lines = buffer.split('\n');
//         buffer = lines.pop(); // la última línea puede estar incompleta

//         for (const line of lines) {
//           if (!line.trim()) {continue;}

//           try {
//             const parsed = JSON.parse(line);
//             if (parsed.done) {
//               console.log('🟢 FIN DE GENERACIÓN');
//               return;
//             }
//             if (parsed.response) {
//               setResponse((prev) => prev + parsed.response);
//             }
//           } catch (err) {
//             console.warn('❗ Error parseando línea JSON', err, line);
//           }
//         }
//       });

//       stream.on('end', () => {
//         setLoading(false);
//       });

//       stream.on('error', (err) => {
//         console.error('Error en streaming:', err);
//         setError(err.message || 'Error en streaming');
//         setLoading(false);
//       });

//     } catch (err) {
//       console.error('Error al hacer la petición:', err);
//       setError(err.message || 'Error al conectar con el servidor');
//       setLoading(false);
//     }
//   };

//   return { handleSubmit, response, error, loading };
// }















// import { useState, useCallback } from 'react';


// export default function useOllamaHook() {
//   const [response, setResponse] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = useCallback(async (prompt) => {
//     console.log('handleSubmit called with prompt:', prompt);
//     setLoading(true);
//     setResponse('');
//     setError(null);

//     try {
//       const res = await fetch('http://localhost:8080/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           model: 'deepseek-r1:1.5b',
//           prompt: prompt,
//           max_tokens: 500,
//           stream: true,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`Error HTTP: ${res.status}`);
//       }

//       if (!res.body) {
//         throw new Error('No se recibió un cuerpo de respuesta');
//       }

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder('utf-8');
//       let buffer = '';
//       let fullResponse = '';

//       const processChunk = (chunk) => {
//         buffer += decoder.decode(chunk, { stream: true });
//         const lines = buffer.split('\n');
//         buffer = lines.pop() || '';

//         for (const line of lines) {
//           if (!line.trim()) continue;
          
//           try {
//             const parsed = JSON.parse(line);
            
//             if (parsed.done) {
//               console.log('🟢 Fin de generación');
//               return true; 
//             }
            
//             if (parsed.response) {
//               fullResponse += parsed.response;
//               setResponse(fullResponse);
//             }
//           } catch (err) {
//             console.error('Error parsing JSON:', err, 'Line:', line);
            
//           }
//         }
//         return false;
//       };

//       let isDone = false;
//       while (!isDone) {
//         const { value, done } = await reader.read();
//         if (done) break;
//         isDone = processChunk(value);
//       }

//       if (buffer.trim()) {
//         try {
//           const parsed = JSON.parse(buffer);
//           if (parsed.response) {
//             setResponse(prev => prev + parsed.response);
//           }
//         } catch (err) {
//           console.error('Error parsing final buffer:', err);
//         }
//       }

//     } catch (err) {
//       console.error("Error en useOllamaHook:", err);
//       setError(err.message || 'Error al comunicarse con el servidor');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { handleSubmit, response, error, loading };
// }