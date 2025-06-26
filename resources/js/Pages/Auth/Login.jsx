import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import FlashedMessages from '@/Layouts/FlashMessage';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Log Masuk" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 2-2 2-2 2 .895 2 2zm0 0v4m0 0H9m3 0h3m-3-4v-2a4 4 0 10-8 0v2m8 0h8" />
                        </svg>
                    </div>
                </div>

                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                    Selamat datang ke <span className="text-red-600">FireMAS</span>
                </h2>
                <p className="mt-1 text-center text-sm text-gray-600">
                    Sila log masuk untuk mengakses sistem
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    <FlashedMessages />

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                label="Alamat E-mel"
                                placeholder="nama@contoh.com"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                label="Kata Laluan"
                                placeholder="Masukkan kata laluan"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {canResetPassword && (
                            <div className="mb-4 text-right">
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-gray-600 hover:text-red-600"
                                >
                                    Lupa Kata Laluan?
                                </Link>
                            </div>
                        )}

                        <PrimaryButton className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" disabled={processing}>
                            Log Masuk
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
