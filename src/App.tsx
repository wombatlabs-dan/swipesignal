import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing'

function Loading() {
  return <div>Loading</div>
}

function SwipeStack() {
  return <div>Swipe</div>
}

function EmailOutput() {
  return <div>Email</div>
}

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
