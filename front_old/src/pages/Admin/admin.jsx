import Sidebar from './Components/sidebar';
import { Outlet } from 'react-router-dom';

const Admin = () => {
    return ( 
        <div className="flex h-full bg-gray-100 ">
            <Sidebar />
            <div className="flex-1 p-10">
                <Outlet /> 
            </div>
        </div>
     );
}
 
export default Admin;