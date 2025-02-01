import Sidebar from './Components/sidebar';
import { Outlet } from 'react-router-dom';
const Etudiant = () => {

    return (
        <div className="flex  min-h-screen  bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-2">
            <Outlet /> 
        </div>
    </div>
    );
}

export default Etudiant;