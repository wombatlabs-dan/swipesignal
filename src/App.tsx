import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function Landing() {
  return <div>Landing Screen</div>
}

function Loading() {
  return <div>Loading Screen</div>
}

function SwipeStack() {
  return <div>Swipe Stack Screen</div>
}

function EmailOutput() {
  return <div>Email Output Screen</div>
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
