import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import InsightStagePage from './pages/stages/InsightStagePage'
import PlanningStagePage from './pages/stages/PlanningStagePage'
import ColdStartStagePage from './pages/stages/ColdStartStagePage'
import ScaleUpStagePage from './pages/stages/ScaleUpStagePage'
import OverviewPage from './pages/stages/OverviewPage'
import RoleDetailPageWrapper from './pages/roles/RoleDetailPageWrapper'
import EcommerceOwnerPlanningConfirmPage from './pages/roles/EcommerceOwnerPlanningConfirmPage'
import BrandOwnerIdeaApprovalPage from './pages/roles/BrandOwnerIdeaApprovalPage'
import EcommerceOwnerIdeaApprovalPage from './pages/roles/EcommerceOwnerIdeaApprovalPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/stages/overview" replace />} />
        <Route path="/stages/overview" element={<OverviewPage />} />
        <Route path="/stages/insight" element={<InsightStagePage />} />
        <Route path="/stages/planning" element={<PlanningStagePage />} />
        <Route path="/stages/cold-start" element={<ColdStartStagePage />} />
        <Route path="/stages/scale-up" element={<ScaleUpStagePage />} />
        <Route path="/roles/:roleId" element={<RoleDetailPageWrapper />} />
        <Route path="/roles/ecommerce_owner/planning-confirm" element={<EcommerceOwnerPlanningConfirmPage />} />
        <Route path="/planning/approval/:ideaId" element={<BrandOwnerIdeaApprovalPage />} />
        <Route path="/roles/ecommerce-owner/planning/approve/:ideaId" element={<EcommerceOwnerIdeaApprovalPage />} />
      </Routes>
    </Router>
  )
}

export default App
