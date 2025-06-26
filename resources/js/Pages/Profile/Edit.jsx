import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, useForm } from '@inertiajs/react';
import { Box, Stack, Typography, Button, Avatar, } from '@mui/material';
import { useState, useRef } from 'react';
import { contentBackgroundStyles } from '@/Utils/constants';
import TitleCaptions from '@/Components/ui/TitleCaptions';
import CustomTextField from '@/Components/ui/field/CustomTextField';

export default function Edit({ auth, mustVerifyEmail, status }) {


    const {data , setData, post, processing, errors} = useForm({
        avatar: null,
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role.display_name,
        username: auth.user.username
    })


    const fileInputRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(auth.avatar)

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
            setData('avatar', file)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current.click()

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('profile.update'))
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />
            <Box sx={contentBackgroundStyles}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                        Profil
                    </Typography>
                    <Button
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 'var(--button-radius)', width: 220 }}
                    onClick={handleSubmit}
                    >Kemaskini</Button>
                </Box>
                <Stack direction="row" alignItems="center" spacing={3} margin={4}>
                    {/* Avatar */}
                    <Avatar
                        alt="Profile"
                        src={previewUrl}
                        sx={{ width: 200, height: 200 }}
                    />

                    {/* Upload Section */}
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button
                                variant="outlined"
                                onClick={handleUploadClick}
                                sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#003366', color: '#003366' }}
                            >
                                Muat Naik Gambar
                            </Button>
                            {selectedFile && (
                                <Typography fontWeight={500}>
                                    {selectedFile.name}
                                </Typography>
                            )}
                        </Stack>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 1, fontStyle: 'italic' }}
                        >
                            	Saiz maksimum adalah 2MB<br/>
                                Saiz optimum : 200px x 200px (petak)
                        </Typography>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </Box>
                </Stack>
                <TitleCaptions title="Kemaskini Profil" extraStyles={{ my: 4 }} />
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <CustomTextField
                        label="Nama"
                        value={data.name}
                        width={200}
                        onChange={(e) => setData('name', e.target.value)}
                        variant="standard"
                    />

                    <CustomTextField
                        label="Emel"
                        value={data.email}
                        width={200}
                        onChange={(e) => setData('email', e.target.value)}
                        type="email"
                        variant="standard"
                    />
                    <CustomTextField
                        label="Peranan"
                        value={data.role}
                        width={200}
                        onChange={(e) => setData('role', e.target.value)}
                        variant="standard"
                        disabled
                    />
                    <CustomTextField
                        label="Kata Laluan"
                        width={200}
                        type="password"
                        onChange={(e) => setData('password', e.target.value)}
                        variant="standard"
                    />
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontStyle: 'italic' }}
                    >
                        Kata laluan mesti mempunyai minimum 8 aksara, sekurang-kurangnya satu huruf besar (A-Z), satu huruf kecil (a-z), satu nombor (0-9), satu simbol khas
                    </Typography>

                </Box>
                {/* <Box sx={{ my: 4 }}>
                    <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)', width: 220 }}>Kemaskini</Button>
                </Box> */}
            </Box>
            {/* <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div> */}
        </AuthenticatedLayout>
    );
}
