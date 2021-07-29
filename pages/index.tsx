import React from 'react';

import { Button } from '@components/ui';

export default function Home() {
  const [todoList, setTodoList] = React.useState<{ title: string; body: string }[]>([]);

  return (
    <div>
      <Button
        onClick={async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/snippets/', {}).then((res) =>
              res.json(),
            );
            console.log(response);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        test Button
      </Button>
    </div>
  );
}
