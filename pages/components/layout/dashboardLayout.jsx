import Link from "next/link";
import Sidebar from "../partials/sidebar";
import HeaderBar from "../partials/HeaderBar";

function DashLayout({children}) {
    return ( 
        <>
<HeaderBar/>
<Sidebar/>

<div class="p-4 sm:ml-64">
    {children}
</div>
        </>
     );
}

export default DashLayout;