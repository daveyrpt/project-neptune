import React from 'react'
import { useForm, usePage } from '@inertiajs/react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from '@mui/material'
import { contentBackgroundStyles } from '@/Utils/constants'

const RolePermissions = () => {
    const { currentRoute, roles, permissions } = usePage().props

    const { data, setData, post, processing, errors } = useForm({
        roles: roles.reduce((acc, role) => {
            acc[role.id] = {
                permissions: role.permissions.map(p => p.id)
            }
            return acc
        }, {})
    })

    const togglePermission = (roleId, permissionId) => {
        const current = data.roles[roleId].permissions
        const exists = current.includes(permissionId)

        setData('roles', {
            ...data.roles,
            [roleId]: {
                permissions: exists
                    ? current.filter(id => id !== permissionId)
                    : [...current, permissionId]
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('role-permission.update'))
    }

    return (
        <Authenticated
            currentRoute={currentRoute}
        >
            <Box sx={contentBackgroundStyles}>
                <Typography variant="h5" gutterBottom>
                    Role Permission Management
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead sx={{ backgroundColor: 'primary.main' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}><strong>Role</strong></TableCell>
                                    <TableCell sx={{ color: 'white' }}><strong>Permissions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>{role.display_name}</TableCell>
                                        <TableCell>
                                            <Box display="flex" flexWrap="wrap" gap={2}>
                                                {permissions.map((permission) => (
                                                    <FormControlLabel
                                                        key={permission.id}
                                                        control={
                                                            <Checkbox
                                                                checked={data.roles[role.id].permissions.includes(permission.id)}
                                                                onChange={() => togglePermission(role.id, permission.id)}
                                                                size="small"
                                                            />
                                                        }
                                                        label={permission.name}
                                                        sx={{ textTransform: 'capitalize' }}
                                                    />
                                                ))}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={processing}
                    >
                        Save Changes
                    </Button>
                </form>
            </Box>
        </Authenticated>
    )
}

export default RolePermissions
