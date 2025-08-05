import { useContext, useEffect, useRef, useState } from 'react';
import useOllamaHook from '../../api/useOllamHook';
import ChatInput from './ChatInput';
import { ChatContext } from '../../context/ChatContext';
import ChatMessage from '../Chat/ChatMessage';

export default function ChatWindow() {
  const { state, dispatch } = useContext(ChatContext);
  const { handleSubmit, response, loading, error } = useOllamaHook();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Manejar la respuesta de la API
  useEffect(() => {
    if (response) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: response }
      });
    }
  }, [response, dispatch]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { 
          role: 'assistant', 
          content: `Error: ${error}`,
          isError: true 
        }
      });
    }
  }, [error, dispatch]);

  const handleSend = async () => {
    if (!currentPrompt.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = { role: 'user', content: currentPrompt };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    setCurrentPrompt('');
    
    try {
      await handleSubmit(currentPrompt);
      
      // Agregar al historial
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: {
          prompt: currentPrompt,
          date: new Date().toISOString(),
          messages: [...state.messages, userMessage],
        },
      });
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {state.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-bold mb-2">DevSeek Chat</h2>
              <p>Envía un mensaje para comenzar la conversación</p>
              <p className="text-sm mt-4">Usando modelo {state.currentModel} con Ollama</p>
            </div>
          </div>
        ) : (
          state.messages.map((msg, index) => (
            <ChatMessage 
              key={index} 
              role={msg.role} 
              content={msg.content} 
              isError={msg.isError}
            />
          ))
        )}
        {loading && state.messages.length > 0 && (
          <div className="text-gray-500 italic">Escribiendo...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput
        value={currentPrompt}
        onChange={setCurrentPrompt}
        onSend={handleSend}
        loading={loading}
      />
    </div>
  );
}