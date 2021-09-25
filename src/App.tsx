import React, { useEffect } from 'react'
import logo from './logo.svg'
import tauriCircles from './tauri.svg'
import tauriWord from './wordmark.svg'
import './App.css'
import { invoke } from '@tauri-apps/api/tauri'
import { emit, listen } from '@tauri-apps/api/event'

function invokeSyncCommand() {
  invoke('command_sync').then((message) => console.log(message))
}

function invokeAsyncCommand() {
  invoke('command_async').then((message) => console.log(message))
}

function emitMessages() {
  const payload = {
    message: "Sending message from js"
  }
  emit('js2rust_message', JSON.stringify(payload))
}

function App() {
  useEffect(() => {
    const f = async () => {
      const unlisten = await listen('rust2js_message', event => {
        console.log(`got ${event.event} ${JSON.stringify(event.payload)}`);
      })
      return unlisten
    }
    f()
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="inline-logo">
          <img src={tauriCircles} className="App-logo rotate" alt="logo" />
          <img src={tauriWord} className="App-logo smaller" alt="logo" />
        </div>
        <a
          className="App-link"
          href="https://tauri.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Tauri
        </a>
        <img src={logo} className="App-logo rotate" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={invokeSyncCommand}>Invoke Sync Command</button>
        <button onClick={invokeAsyncCommand}>Invoke Async Command</button>
        <button onClick={emitMessages}>Emit Messages</button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
