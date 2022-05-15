# react-fade

Proof of Concept react fade in/out that just works without any effort.

<img src="prpeview.gif" />

```tsx
interface MessagesProps {
  messages: string[];
  onRemoveMessage: (x: string) => void;
}
const Messages = ({ messages, onRemoveMessage }: MessagesProps) => {
  return (
    <div>
      {messages.map((x) => (
        <MessageBubble key={x}>
          {x} <button onClick={() => onRemoveMessage(x)}>X</button>
        </MessageBubble>
      ))}
    </div>
  );
};
```
