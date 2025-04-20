import { Application, extend } from '@pixi/react'
import MyContainer from './MyContainer'
import { Container } from 'pixi.js'

// Extend PixiJS components for JSX usage
extend({ Container })

function App() {
  return (
    <Application
      background={'#1099bb'}
      resizeTo={window}
      preference="webgl"
      autoDensity={true}
      resolution={window.devicePixelRatio || 1}
      powerPreference="high-performance"
    >
      <MyContainer />
    </Application>
  )
}

export default App
