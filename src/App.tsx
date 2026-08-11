import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { API_URL } from './shared/config'

function App() {
  const [count, setCount] = useState(0)

  console.log(API_URL)

  return (
    <>
      <div className="border border-amber-400 p-2.5">
        <Button variant="outline" onClick={() => setCount(count + 1)}>
          Click me: {count}
        </Button>
      </div>
    </>
  )
}

export default App
