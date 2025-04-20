import { Application, extend } from '@pixi/react'
import MyContainer from './MyContainer'
import { Container, GpuPowerPreference } from 'pixi.js'
import { useControls } from 'leva'

// Extend PixiJS components for JSX usage
extend({ Container })

function App() {
  const { toggleWebGpu, toggleAutoDensity, powerPreference } = useControls({
    toggleWebGpu: {
      label: 'webgpu',
      value: false,
    },
    toggleAutoDensity: {
      label: 'autoDensity',
      value: true,
    },
    powerPreference: {
      options: ['high-performance', 'low-power'],
      value: 'high-performance',
    },
  })

  return (
    <Application
      background={'#1099bb'}
      resizeTo={window}
      preference={toggleWebGpu ? 'webgpu' : 'webgl'}
      autoDensity={toggleAutoDensity}
      resolution={window.devicePixelRatio || 1}
      powerPreference={powerPreference as GpuPowerPreference}
    >
      <MyContainer />
    </Application>
  )
}

export default App
