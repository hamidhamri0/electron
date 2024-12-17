import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from '@renderer/pages/SignIn'
import SignUp from '@renderer/pages/SignUp'
import ProtectedRoutes from '@renderer/pages/ProtectedRoutes'
import { PublicOnlyRoutes } from '@renderer/pages/PublicOnlyRoutes'
import NotFound from '@renderer/pages/NotFound'
import VerificationSent from '@renderer/pages/VerificationSent'
import VerificationEmail from '@renderer/pages/EmailVerification'

function App() {
  console.log('APP')
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="c/:chatId" element={<Home />} />
        </Route>
        <Route element={<PublicOnlyRoutes />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerificationSent />} />
          <Route path="/verifying-email" element={<VerificationEmail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
