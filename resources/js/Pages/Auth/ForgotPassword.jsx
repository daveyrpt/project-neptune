import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import { Button } from '@mui/material';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600">
                Lupa kata laluan anda? Tiada masalah. Masukkan alamat e-mel berdaftar anda dan kami akan menghantar e-mel pautan tetapan semula kata laluan.
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center flex-col justify-end mt-4 gap-4">
                    <PrimaryButton className="" disabled={processing}>
                        Tetap Semula Kata Laluan
                    </PrimaryButton>

                </div>
            </form>
            <a href={route('login')}>
            <button
                className={
                    `inline-flex items-center mt-4 px-4 py-2 bg-[#1692E6] justify-center w-full border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widestn ease-in-out duration-150`
                }

            >
               Kembali ke Log Masuk
            </button>
            </a>
        </GuestLayout>
    );
}
