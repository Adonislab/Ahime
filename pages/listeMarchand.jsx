import Marchand from './components/layout/MarchandTable'
import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";

export default function listeMarchand() {
  return (
    <DashLayout>
        <Head/>    
        <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
            <Marchand/>
        </div>
    </DashLayout>
  )
}
