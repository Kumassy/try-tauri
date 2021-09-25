import React, { useEffect } from 'react'
import logo from './logo.svg'
import tauriCircles from './tauri.svg'
import tauriWord from './wordmark.svg'
import './App.css'
import { invoke } from '@tauri-apps/api/tauri'
import { emit, listen } from '@tauri-apps/api/event'

function onClick() {
  console.log("clicked");
  invoke('my_command_sync').then((message) => console.log(message))
  invoke('my_command_async').then((message) => console.log(message))

  const payload = {
    message: "foobargbaz"
  }
  emit('click_bar', JSON.stringify(payload))
}

function App() {
  useEffect(() => {
    const f = async () => {
      const unlisten = await listen('click_foo', event => {
        console.log('event click was called');
        console.log(event);
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
        <button onClick={onClick}>click</button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
