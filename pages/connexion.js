import { login_user } from '@/services';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from '@/utils/head';
import Router from 'next/router';

export default function Home() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const res = await login_user(formData);
    if (res.success) {
      toast.success(res.message);
      // Redirect to the dashboard or another page
      Router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  const handleSignUpRedirect = () => {
    Router.push("/register");
  };

  return (
    <>
      <Head />
      <section className="bg-indigo-700 text-center h-screen text-indigo-600">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
                Accédez à mon tableau de bord Ahime 
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className='text-left'>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Votre email</label>
                  <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                </div>
                <div className='text-left'>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Votre mot de passe</label>
                  <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" name="password" id="password" placeholder="••••••••" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Connexion</button>
              </form>
              
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  )
}
