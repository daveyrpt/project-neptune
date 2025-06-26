import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, usePage, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SidebarHeader from './sidebar/SidebarHeader';
import { ChartBarIcon, BanknotesIcon, CogIcon, DocumentIcon, ArrowRightEndOnRectangleIcon, CurrencyDollarIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/solid';
import { sidebarPaddingStyles } from "@/Utils/constants.jsx";
import { Avatar, Badge } from '@mui/material';
import { useLocalStorage } from 'react-use';

export default function SidebarMultilevel({ currentRoute }) {

    const { auth } = usePage().props;
    const permissions = auth.permissions || [];

    const [value, setValue, remove] = useLocalStorage('collapsed', true);

    const [open, setOpen] = useState(undefined);
    const [collapsed, setCollapsed] = useState(value);
    const [tableContainerSize, setTableContainerSize] = useState(0)

    const { post } = useForm();
    const handleOpenSubMenu = (key) => {
        if (open === key) {
            setOpen(undefined);
        } else {
            setOpen(key);
        }
    }

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    return (
        <Sidebar
            className='text-white'
            backgroundColor='#004269'
            width='300px'
            collapsed={collapsed}
            style={{ height: '100vh', overflowY: 'auto' }}
        >
            {
                collapsed ? (

                    <Avatar
                        alt='user_profile'
                        src='/images/Labuan.jpg'
                        sx={{ width: 56, height: 56, margin: '10px' }}
                        onClick={() => {
                            setCollapsed(!collapsed)
                            setValue(!collapsed)
                        }}
                    />
                ) : (
                    <>
                        <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} setValue={setValue} />
                        <div className='px-4 mb-3' style={sidebarPaddingStyles} >
                            <div className="grid grid-cols-2 mb-3">
                                <p className='text-sm text-gray-500 text-[14px]'>Menu Utama</p>
                                <p className='text-right text-sm text-gray-500 text-[14px]'>Version 5</p>
                            </div>
                            <hr className='border-gray-500' />
                        </div>
                    </>
                )
            }

            <Menu
                menuItemStyles={{
                    button: ({ level, active, disabled }) => {
                        // only apply styles on first level elements of the tree

                        return {
                            color: disabled ? '#ffffff' : '#ffffff',
                            backgroundColor: active ? '#F69B00' : undefined,
                            // margin: '5px 10px',
                            borderRadius: active ? '10px' : undefined,
                            padding: sidebarPaddingStyles,
                            fontSize: '14px',
                            '&:hover': {
                                backgroundColor: '#F69B00',
                                borderRadius: '10px'
                            }
                        };
                    },
                    root: ({ level, active, disabled }) => {
                        if (level === 1) {
                            return {
                                backgroundColor: '#003652',
                                color: '#fffffff',
                                '&:hover': {
                                    backgroundColor: '#F69B00',
                                    borderRadius: '10px'
                                },
                            }
                        }
                    },

                }}
            >

                {
                    permissions.includes('read dashboard admin') && (
                        <MenuItem
                            icon={<ChartBarIcon className='size-4' />}
                            active={currentRoute === 'dashboard'}
                            component={<Link href={route('dashboard')} />}
                        >
                            Paparan Utama
                        </MenuItem>
                    )
                }

                {
                    permissions.includes('read dashboard cashier') && (
                        <MenuItem
                            icon={<ChartBarIcon className='size-4' />}
                            active={currentRoute === 'dashboard'}
                            component={<Link href={route('dashboard')} />}
                        >
                            Paparan Utama
                        </MenuItem>
                    )
                }


                {
                    permissions.includes('read advance payment request') && (
                        <MenuItem
                            icon={<BanknotesIcon className='size-4' />}
                            active={currentRoute === 'advance-payment-request.index'}
                            component={<Link href={route('advance-payment-request.index')} />}
                        >
                            Bayaran Pendahuluan
                        </MenuItem>
                    )
                }

                {
                    auth.user.role.name === 'counter_supervisor' && (
                        <MenuItem
                            icon={<BanknotesIcon className='size-4' />}
                            active={currentRoute === 'system.starting-day'}
                            component={<Link href={route('system.starting-day')} />}
                        >
                            Tarikh Permulaan Hari
                        </MenuItem>
                    )
                }

                {
                    permissions.includes('read system') && (
                        <SubMenu
                            icon={<CogIcon className='size-4' />}
                            label="Sistem"
                            onClick={() => handleOpenSubMenu('system')}
                            open={([
                                'system.configuration',
                                'system.code-maintenance.receipt.index',
                                'system.code-maintenance.century-financial.index',
                                'user.index',
                                'integration.index',
                                'system.edit-receipt-number.index'
                            ].includes(currentRoute)) || open === 'system' || open === 'system.code-maintenance'}
                            rootStyles={{
                                ['& > .ps-menu-button']: {
                                    backgroundColor: '#004269',
                                    color: '#fffffff',
                                    '&:hover': {
                                        backgroundColor: '#F69B00',
                                        borderRadius: '10px'
                                    },
                                },
                                ['.ps-submenu-content']: {
                                    backgroundColor: '#004269',
                                },
                            }}
                        >

                            {
                                permissions.some(p => ['manage configuration system', 'read code maintenance'].includes(p)) && (
                                    <>
                                        {
                                            permissions.includes('manage configuration system') && (
                                                <MenuItem
                                                    component={<Link href={route('system.configuration')} />}
                                                    active={currentRoute === 'system.configuration'}
                                                >
                                                    Konfigurasi Sistem
                                                </MenuItem>
                                            )
                                        }

                                        {
                                            permissions.includes('read code maintenance') &&
                                            <SubMenu
                                                label="Penyelenggaraan Kod"
                                                onClick={() => handleOpenSubMenu('system.code-maintenance')}
                                                open={([
                                                    'system.code-maintenance.receipt.index',
                                                    'system.code-maintenance.century-financial.index'
                                                ].includes(currentRoute)) || open === 'system.code-maintenance'}
                                            >


                                                <MenuItem
                                                    component={<Link href={route('system.code-maintenance.receipt.index')} />}
                                                    active={currentRoute === 'system.code-maintenance.receipt.index'}
                                                >
                                                    Terimaan
                                                </MenuItem>

                                                <MenuItem
                                                    component={<Link href={route('system.code-maintenance.century-financial.index')} />}
                                                    active={currentRoute === 'system.code-maintenance.century-financial.index'}
                                                >
                                                    Century Financial
                                                </MenuItem>

                                            </SubMenu>
                                        }
                                    </>

                                )
                            }

                            {
                                permissions.includes('read user') && (
                                    <MenuItem
                                        component={<Link href={route('user.index')} />}
                                        active={currentRoute === 'user.index'}
                                    >
                                        Pengurusan Pengguna
                                    </MenuItem>
                                )
                            }

                            {/* {
                                permissions.includes('read integration') && (
                                    <MenuItem
                                        component={<Link href={route('integration.index')} />}
                                        active={currentRoute === 'integration.index'}
                                    >
                                        Integrasi
                                    </MenuItem>
                                )
                            } */}

                            {/* {
                                permissions.includes('read list of receipt') && (
                                    <MenuItem
                                        component={<Link href={route('system.edit-receipt-number.index')} />}
                                        active={currentRoute === 'system.edit-receipt-number.index'}
                                    >
                                        Kemaskini Nombor Resit
                                    </MenuItem>
                                )
                            } */}

                        </SubMenu>
                    )
                }

                {
                    permissions.includes('read processing receipt') && (
                        <SubMenu
                            icon={<BanknotesIcon className='size-4' />}
                            label="Proses Terimaan"
                            open={[
                                'counter.open.index',
                                'cashier-management.index',
                                'receipt.create',
                                'receipt.index',
                                'receipt.cancel.index',
                                'counter.close.index',
                                'cash-receipt-breakdown.form',
                                'cash-receipt-breakdown.index',
                                'osp.index'
                            ].includes(currentRoute) || open === 'sub1'}
                            onClick={() => handleOpenSubMenu('sub1')}
                            rootStyles={{
                                ['& > .ps-menu-button']: {
                                    backgroundColor: '#004269',
                                    color: '#fffffff',
                                    '&:hover': {
                                        backgroundColor: '#F69B00',
                                        borderRadius: '10px'
                                    },
                                },
                                ['.ps-submenu-content']: {
                                    backgroundColor: '#004269',
                                },
                            }}
                        >

                            {
                                permissions.includes('read cashier management') && (
                                    <MenuItem
                                        component={<Link href={route('cashier-management.index')} />}
                                        active={currentRoute === 'cashier-management.index'}
                                    >
                                        Kawalan Juruwang
                                    </MenuItem>
                                )
                            }

                            {
                                permissions.includes('create receipt form') && (
                                    <MenuItem
                                        component={<Link href={route('receipt.create')} />}
                                        active={currentRoute === 'receipt.create'}
                                    >
                                        Terimaan
                                    </MenuItem>
                                )
                            }

                            {
                                permissions.includes('read list of receipt') && (
                                    <MenuItem
                                        component={<Link href={route('receipt.index')} />}
                                        active={currentRoute === 'receipt.index'}
                                    >
                                        Senarai Terimaan
                                    </MenuItem>
                                )
                            }

                            {
                                permissions.includes('read receipt cancel') && (
                                    <MenuItem
                                        component={<Link href={route('receipt.cancel.index')} />}
                                        active={currentRoute === 'receipt.cancel.index'}
                                        suffix={
                                            <Badge color="error" badgeContent={auth.sidemenu_badge.batal_resit} shape="circle" />
                                        }
                                    >
                                        Permohonan Batal Resit
                                    </MenuItem>
                                )
                            }

                            {/* {
                                permissions.includes('manage close counter') && (
                                    <MenuItem
                                        component={<Link href={route('counter.close.index')} />}
                                        active={currentRoute === 'counter.close.index'}
                                    >
                                        Tutup Kaunter
                                    </MenuItem>
                                )
                            } */}

                            {
                                permissions.includes('manage osp') && (
                                    <MenuItem
                                        component={<Link href={route('osp.index')} />}
                                        active={currentRoute === 'osp.index'}
                                    >
                                        OSP
                                    </MenuItem>
                                )
                            }
                            {
                                permissions.includes('read cash receipt breakdown') && (
                                    <MenuItem
                                        component={<Link href={route('cash-receipt-breakdown.form')} />}
                                        active={currentRoute === 'cash-receipt-breakdown.form'}
                                    >
                                        Pecahan Terimaan Tunai
                                    </MenuItem>
                                )
                            }
                            {
                                permissions.includes('list cash receipt breakdown') && (
                                    <MenuItem
                                        component={<Link href={route('cash-receipt-breakdown.index')} />}
                                        active={currentRoute === 'cash-receipt-breakdown.index'}
                                    >
                                        Senarai Pecahan Terimaan Tunai
                                    </MenuItem>
                                )
                            }

                        </SubMenu>
                    )
                }
                <MenuItem
                    icon={<DocumentIcon className='size-4' />}
                    component={<Link href={route('report.index')} />}
                    active={currentRoute === 'report.index'}
                >
                    Laporan
                </MenuItem>

                {
                    permissions.includes('read float cash') && (
                        <SubMenu
                            icon={<CurrencyDollarIcon className='size-4' />}
                            label="Wang Apungan"
                            open={[
                                'float-cash.request-form',
                                'float-cash.index',
                            ].includes(currentRoute) || open === 'sub2'}
                            onClick={() => handleOpenSubMenu('sub2')}
                            rootStyles={{
                                ['& > .ps-menu-button']: {
                                    backgroundColor: '#004269',
                                    color: '#fffffff',
                                    '&:hover': {
                                        backgroundColor: '#F69B00',
                                        borderRadius: '10px'
                                    },
                                },
                                ['.ps-submenu-content']: {
                                    backgroundColor: '#004269',
                                },
                            }}
                        >
                            {
                                permissions.includes('create float cash request form') && (
                                    <MenuItem
                                        component={<Link href={route('float-cash.request-form')} />}
                                        active={currentRoute === 'float-cash.request-form'}
                                    >
                                        Permohonan
                                    </MenuItem>
                                )
                            }
                            {
                                permissions.includes('read float cash') && (
                                    <MenuItem
                                        component={<Link href={route('float-cash.index')} />}
                                        active={currentRoute === 'float-cash.index'}
                                        suffix={
                                            <Badge color="error" badgeContent={auth.sidemenu_badge.wang_apungan} shape="circle" />
                                        }
                                    >
                                        Senarai Permohonan
                                    </MenuItem>
                                )
                            }
                        </SubMenu>
                    )
                }

                {
                    permissions.includes('read terminal management') && (
                        <MenuItem
                            icon={<Cog6ToothIcon className='size-4' />}
                            component={<Link href={route('terminal-management.index')} />}
                        >
                            Kawalan Terminal
                        </MenuItem>
                    )
                }
                <MenuItem
                    icon={<UserIcon className='size-4' />}
                    component={<Link href={route('profile.edit')} />}
                    active={currentRoute === 'profile.edit'}
                >
                    Profil
                </MenuItem>

                {
                    permissions.includes('role permission') && (
                        <MenuItem
                            icon={<UserIcon className='size-4' />}
                            component={<Link href={route('role-permission.index')} />}
                            active={currentRoute === 'role-permission.index'}
                        >
                            Role-permission
                        </MenuItem>
                    )
                }

                <MenuItem
                    icon={<ArrowRightEndOnRectangleIcon className='size-4' />}
                    onClick={handleLogout}
                >
                    Log Keluar
                </MenuItem>
            </Menu>
        </Sidebar>
    );
}
