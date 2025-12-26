import { BrowserRouter, Routes, Route } from "react-router-dom";
import CeoLogin from "./pages/login/CeoLogin";
import EmployeeLogin from "./pages/login/EmployeeLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import CeoDashboard from "./ceo/CeoDashboard";
import EmployeeDashboard from "./employee/EmployeeDashboard";
import PendingWork from "./ceo/PendingWork";
import EmployeeList from "./ceo/EmployeeList";
import CeoLayout from "./layouts/CeoLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import CreateEmployee from "./ceo/CreateEmployee";
import EmployeeDetails from "./ceo/EmployeeDetails";
import AssignTask from "./ceo/AssignTask";
import EmployeeManagement from "./ceo/EmployeeManagement";
import EmployeeTasks from "./employee/EmployeeTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeLogin />} />
        <Route path="/ceo-login" element={<CeoLogin />} />

        <Route
          path="/ceo/dashboard"
          element={
            <ProtectedRoute role="CEO">
              <CeoLayout>
                <CeoDashboard />
              </CeoLayout>
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/ceo/employees"
          element={
            <ProtectedRoute role="CEO">
              <CeoLayout>
                <EmployeeList />
              </CeoLayout>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/ceo/employees"
          element={
            <ProtectedRoute role="CEO">
              <CeoLayout>
                <EmployeeManagement />
              </CeoLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ceo/pending"
          element={
            <ProtectedRoute role="CEO">
              <CeoLayout>
                <PendingWork />
              </CeoLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ceo/create-employee"
          element={
            <ProtectedRoute role="CEO">
              <CeoLayout>
                <CreateEmployee />
              </CeoLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ceo/employees/:id"
          element={
            <ProtectedRoute role="CEO">
              <CeoLayout>
                <EmployeeDetails />
              </CeoLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ceo/assign-task"
          element={
            <ProtectedRoute role="CEO">
              <CeoLayout>
                <AssignTask />
              </CeoLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <EmployeeLayout>
                <EmployeeDashboard />
              </EmployeeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/tasks"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <EmployeeLayout>
                <EmployeeTasks />
              </EmployeeLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
