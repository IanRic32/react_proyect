import { ChatProvider } from './context/ChatProvider';
import './App.css';
import ChatWindow from './components/Chat/ChatWindow';

export default function App() {
  return (
    <ChatProvider>
      <div className="h-screen flex">
        {/* Si necesitas el historial más adelante:
        <div className="w-1/4 border-r">
          <HistoryList />
        </div> */}
        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}