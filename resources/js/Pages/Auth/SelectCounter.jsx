import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';

import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Avatar,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
} from '@mui/material';
import FlashedMessages from '@/Layouts/FlashMessage';

export default function SelectCounter({ status, canResetPassword }) {

    const { auth, collection_centers, default_cashier_location } = usePage().props;

    const [collectionCenter, setCollectionCenter] = useState([]);
    const [counter, setCounter] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        collection_center_id: default_cashier_location?.collection_center_id ?? '',
        counter_id: default_cashier_location?.counter_id ?? '',
    });

    const handleChangeCollectionCenter = (e) => {
        setData({ ...data, collection_center_id: e.target.value })
        const counters = collection_centers.filter((item) => item.id === e.target.value)
        setCounter(counters[0].counters)
    }

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('counter-and-collection-center.store'));
    };

    useEffect(() => {
        setCollectionCenter(
            collection_centers.map((item) => {
                return { id: item.id, code: item.code };
            })
        );

        setCounter(
            collection_centers[0].counters.map((item) => {
                return { id: item.id, code: item.code, name: item.name };
            })
        );
    }, []);

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-cover bg-[url(/images/LabuanLogin.jpg)]">
            <FlashedMessages />
            <div className='bg-white sm:rounded-[20px] p-3 flex flex-col justify-center items-center'>
                <div className='flex justify-between'>
                    <div className='flex flex-row'>
                        <Avatar alt='user_profile' src={auth?.avatar} sx={{ width: 56, height: 56, marginRight: 2 }} />
                        <h3 className="text-[15px]">
                            Selamat Datang<br></br>
                            {auth.user?.name}
                        </h3>
                    </div>
                    <div>
                        <img src="/images/Labuan.jpg" alt="" className='w-20 h-20' />
                    </div>
                </div>
                <div className='mt-2 text-center'>
                    <h3 className="text-[20px] font-bold">
                        No. Kaunter Dan Pusat Kutipan
                    </h3>
                    <p>
                        Sila Pilih No. Kaunter dan Pusat Kutipan anda pada hari ini.
                    </p>
                </div>
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 overflow-hidden ">
                    <Head title="Pilih Kaunter" />

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit}>
                        <div>
                            <FormControl fullWidth size="small">
                                <InputLabel id="counter-select">Pusat Kutipan</InputLabel>
                                <Select
                                    labelId="counter-select"
                                    label="Pusat Kutipan"
                                    value={data.collection_center_id}
                                    onChange={handleChangeCollectionCenter}
                                >
                                    {
                                        collectionCenter?.length == 0 ?
                                            (
                                                <MenuItem value="">Tiada</MenuItem>
                                            ) :
                                            collectionCenter.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.code}</MenuItem>
                                            ))
                                    }
                                </Select>
                            </FormControl>
                            <InputError message={errors.counter} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <FormControl fullWidth size="small">
                                <InputLabel id="counter-select">Kaunter</InputLabel>
                                <Select
                                    labelId="counter-select"
                                    id="demo-simple-select"
                                    label="Kaunter"
                                    value={data.counter_id}
                                    onChange={(e) => setData({ ...data, counter_id: e.target.value })}
                                >
                                    {
                                        counter?.length == 0 ?
                                            (
                                                <MenuItem value={default_cashier_location.counter_id}>{default_cashier_location.counter_name}</MenuItem>
                                            ) :
                                            counter.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                            ))
                                    }
                                </Select>
                            </FormControl>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton disabled={processing}>
                                Seterusnya
                            </PrimaryButton>


                        </div>

                        <div className="flex items-center justify-end mt-4">
                            {/* Skip button */}
                            <Link
                                href={route('dashboard')}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Langkau
                            </Link>

                        </div>
                                                    
                    </form>
                </div>
            </div>
        </div>
    );
}
