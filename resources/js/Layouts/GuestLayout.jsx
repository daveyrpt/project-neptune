import { useEffect } from "react";

export default function Guest({ children }) {

    useEffect(()=>{
        sessionStorage.setItem("default-scaling", window.devicePixelRatio)
    },[])

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-cover bg-[url(/images/LabuanLogin.jpg)]">
            <div className='grid grid-cols-1 md:grid-cols-2'>
                <div className='sm:rounded-lg'>
                    <div className="relative w-[100%] h-[100%] flex items-center justify-center bg-cover bg-center rounded-l-[20px] bg-[url('/images/LabuanLogin2.jpg')] overflow-hidden">
                        <div className="absolute inset-0 bg-black/40"></div>

                        <div className="relative z-10 text-center px-6">
                            <h2 className="text-white text-lg md:text-xl font-semibold">Selamat Datang</h2>
                            <h1 className="text-white text-2xl md:text-4xl font-bold mt-1">ke FireMAS</h1>
                        </div>
                    </div>
                    {/* <img src="/images/LabuanLogin2.jpg" alt="" width={'500'} className='rounded-l-[20px]' /> */}
                </div>
                <div className='bg-white sm:rounded-r-[20px] p-5 flex flex-col justify-center items-center'>
                    <div>
                        <img src="/images/Labuan.jpg" alt="" className='w-20 h-20' />
                    </div>
                    <div className='mt-2 text-center'>
                        <h3 className="text-[20px] font-bold">
                            Log Masuk Ke Akaun<br></br> Anda Sekarang
                        </h3>
                    </div>
                    <div className="w-full sm:max-w-md mt-6 px-6 py-4 overflow-hidden ">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
