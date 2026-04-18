import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing'
import Loading from './screens/Loading'
import SwipeStack from './screens/SwipeStack'
import EmailOutput from './screens/EmailOutput'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/swipe" element={<SwipeStack />} />
        <Route path="/email" element={<EmailOutput />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
