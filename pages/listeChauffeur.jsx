import Marchand from './components/layout/ChauffeurTable'
import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";

export default function listeChauffeur() {
  return (
    <DashLayout>
        <Head/>    
        <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
            <Marchand/>
        </div>
    </DashLayout>
  )
}
