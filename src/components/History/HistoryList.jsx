import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import HistoryItem from './HistoryItem';

export default function HistoryList() {
  const { state, dispatch } = useContext(ChatContext);

  const loadHistory = (historyItem) => {
    dispatch({
      type: 'LOAD_HISTORY',
      payload: { messages: historyItem.messages },
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Historial</h2>
      <div className="space-y-2">
        {state.history.map((item, index) => (
          <HistoryItem
            key={index}
            prompt={item.prompt}
            date={item.date}
            onClick={() => loadHistory(item)}
          />
        ))}
      </div>
    </div>
  );
}