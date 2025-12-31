import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 
                Navbar is already included in App.jsx and will be rendered above this Outlet.
                This layout can be used for admin-specific sidebars or context providers in the future.
            */}
            <Outlet />
        </div>
    );
};

export default AdminLayout;
