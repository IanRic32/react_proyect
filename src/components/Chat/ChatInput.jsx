export default function ChatInput({ value, onChange, onSend, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mejor Prompt"
        disabled={loading}
        className="chat-input"
      />
      <button
        onClick={onSend}
        disabled={!value?.trim() || loading}
        className="send-button"
      >
        {loading ? '...' : 'Enviar'}
      </button>
    </div>
  );
}