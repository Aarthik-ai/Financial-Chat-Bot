import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ChatHistoryProps {
  history: string[];
  onSelect: (chat: string) => void;
  onClear: () => void;
}

export default function ChatHistory({ history, onSelect, onClear }: ChatHistoryProps) {
  return (
    <div className="w-64 bg-neutral-100 p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-2">
          {history.map((chat, index) => (
            <div 
              key={index}
              className="p-2 rounded-md hover:bg-neutral-200 cursor-pointer truncate"
              onClick={() => onSelect(chat)}
            >
              {chat}
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button variant="outline" size="sm" onClick={onClear}>Clear History</Button>
    </div>
  );
}
