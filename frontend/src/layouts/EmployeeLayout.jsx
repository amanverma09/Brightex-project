import EmployeeSidebar from "../components/EmployeeSidebar";

const EmployeeLayout = ({ children }) => {
  return (
    <div className="flex bg-slate-900 text-slate-200">
      <EmployeeSidebar />
      <div className="flex-1 min-h-screen">{children}</div>
    </div>
  );
};

export default EmployeeLayout;
