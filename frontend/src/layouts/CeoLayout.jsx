import CeoSidebar from "../components/CeoSidebar";

const CeoLayout = ({ children }) => {
  return (
    <div className="flex bg-slate-900 text-slate-200">
      <CeoSidebar />
      <div className="flex-1 min-h-screen">{children}</div>
    </div>
  );
};

export default CeoLayout;
