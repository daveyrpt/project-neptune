import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Box,
    Typography,
    TableContainer,
    TableRow,
    Table,
    TableHead,
    TableCell,
    TableBody,
    Paper,
    Button,
    FormControl,
    Select,
    MenuItem,
    Stack,
    TextField,
    Autocomplete,
    Input,
    Modal,
    IconButton,
    Menu,
    TextareaAutosize,
} from "@mui/material";
import TitleCaptions from "@/Components/ui/TitleCaptions";
import CustomTextField from "@/Components/ui/field/CustomTextField";
import { useState, useEffect } from "react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { DateField } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import InputError from "@/Components/InputError";
import { contentBackgroundStyles, defaultModalStyles } from "@/Utils/constants.jsx";
import axios from "axios";
import { useDebounce } from "react-use";

export default function Receive() {
    //TODO: validation for payment type. limit only for possible payment types
    //TODO: amount received should be more than amount need to be paid
    //TODO: collection Id and counter Id should be dynamic
    //TODO: Bila user salah isi amaun atas. Baki dikembalikan tak berubah
    //TODO: Letak default collection center dan counter sesuai role user
    //TODO: validation kalau no account lain tak boleh sama no receipt

    const {
        auth,
        currentRoute,
        cashiers,
        collection_centers,
        income_codes,
        payment_types,
        banks,
        current_receipt_number,
        current_bill,
        counters
    } = usePage().props;

    const today = dayjs();

    //Show available counter for selected Pusat Kutipan
    const [counterOptions, setCounterOptions] = useState([]);

    //save bill number that available after api call
    const [availableBillOnRow, setAvailableBillOnRow] = useState([]);

    //Save current receipt number for add and delete
    const [receiptNumber, setReceiptNumber] = useState(current_receipt_number);

    //Add new row when add button is clicked
    const [rows, setRows] = useState([]);

    //Save available account number after api call
    const [resultsAvailableAccount, setResultsAvailableAccount] = useState([[]]);

    //Open modal for open item
    const [openModalOpenItem, setOpenModalOpenItem] = useState(false);

    const [search, setSearch] = useState('');

    useDebounce(() => {
        if (!search) return;
        handleSearchAccountNumber(search);
    },
        500,
        [search]
    );

    const handleOpenItem = () => {
        setOpenModalOpenItem(true);
    }

    const handleClose = () => {
        setOpenModalOpenItem(false);
    }

    //Increment receipt number
    function incrementDynamicReceipt(receipt) {
        const match = receipt.match(/^([A-Z]+\d*)(\d+)$/);

        if (!match) throw new Error('Invalid receipt format');

        const [, prefix, numberPart] = match;
        const numberLength = numberPart.length;
        // setCurrentBill(numberLength);

        const incremented = String(parseInt(numberPart, 10) + 1).padStart(numberLength, '0');

        return prefix + incremented;
    }

    const { data, setData, post, errors, processing, clearErrors } = useForm({
        collection_center_id: auth.user?.current_cashier_opened_counter?.collection_center?.id,
        counter_id: auth.user?.current_cashier_opened_counter?.counter?.id,
        user_id: auth.user.id,
        date: today,
        current_bill: current_bill,
        transactions: [
            {
                account_number: "",
                bill_number: "",
                receipt_number: receiptNumber,
                income_code: "",
                description: "",
                reference_number: "",
                amount: "",
            }
        ],
        payment: [
            {
                type: "",
                amount: 0,
                code_bank: "",
                bank_name: "",
                reference_number: "",
                card_holder_name: "",
            },
        ],
        // receipt_number: receiptNumber,
        // payment_type: '',
        amount_paid: 0,
        return_amount: 0,
    });

    const handleChange = (field, value) => {
        clearErrors();
        const updatedBil = [...data.transactions];
        if (field === "account_number") {
            updatedBil[0][field] = value;
            updatedBil[0]['reference_number'] = value;
            setData("transactions", updatedBil);

            axios.get(`/searchAccountNumber?account_number=${value}`)
                .then(({ data }) => {
                    const availableBill = [...availableBillOnRow];
                    availableBill[0] = data;
                    setAvailableBillOnRow(availableBill);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

        } else if (field === "bill_number") {
            updatedBil[0][field] = value;
            updatedBil[0]['amount'] = value.amount;
            setData("transactions", updatedBil);

        } else {
            updatedBil[0][field] = value;
            setData("transactions", updatedBil);
        }

    };

    const handleSearchAccountNumber = (value) => {
        axios.get(`/searchAccountNumber?account_number=${value}`)
            .then(({ data }) => {
                const availableAccount = [...resultsAvailableAccount];
                availableAccount[0] = data;
                setResultsAvailableAccount(availableAccount);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleRowBayaranChange = (index, field, value) => {
        const updatedPayment = [...data.payment];
        if (field === 'type') {
            //Find the name of the card holder but return nothing if no available account no
            updatedPayment[0]['card_holder_name'] = resultsAvailableAccount[0].length > 0 ? resultsAvailableAccount[0].find(item => item.account_number === data.transactions[0].account_number).name : '';
        }
        updatedPayment[0][field] = value;
        setData("payment", updatedPayment);
    };

    const handleAmountChange = (index, field, value) => {
        const updatedBil = [...data.transactions];
        updatedBil[index][field] = value;
        setData("transactions", updatedBil);
    };

    const handleAmountPaymentChange = (index, field, value) => {
        const updatedPayment = [...data.payment];
        updatedPayment[index][field] = value;
        setData("payment", updatedPayment);
    };

    const amountTotal = data.transactions.reduce((total, item) => total + Number(item.amount || 0), 0);
    const amountReceived = data.payment.reduce((total, item) => total + Number(item.amount || 0), 0);
    const amountReturn = amountReceived - amountTotal;

    const handlePrint = (e) => {
        e.preventDefault();
        post(route("receipt.store"));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('advance-payment-request.store'), {
            onSuccess: () => {
                // Optionally reset or show a toast
                handleClose();
            },
            onError: () => {
                // errors will be available from the `errors` object
            }
        });
    };

    useEffect(() => {
        const parent = document.getElementById("TerimaanTableContainer");

        const handleResize = () => {
            const parentWidth = parent.offsetWidth;
            let baseWidth = 1700;

            if (window.devicePixelRatio >= 1.5) baseWidth = 1480;
            else if (window.devicePixelRatio >= 1.25) baseWidth = 1460;
            else if (window.devicePixelRatio > 1) baseWidth = 1560;

            const scale = parentWidth / baseWidth;

            // 🔥 Select ALL tables you want to scale
            const tables = document.querySelectorAll(".MuiTable-root");

            tables.forEach(child => {
                child.style.transform = `scale(${scale})`;
                child.style.transformOrigin = 'left center';
            });
        };

        handleResize(); // Initial scale
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    console.log(data);

    return (
        <AuthenticatedLayout user={auth.user} currentRoute={currentRoute}>
            <Head title="Terimaan" />
            <Modal
                open={openModalOpenItem}
                onClose={() => setOpenModalOpenItem(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={defaultModalStyles}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Pendaftaran No. Akaun
                    </Typography>
                    <Typography component="p">
                        Maklumat ini didaftar sekiranya pelanggan ingin membayar bil yang belum dijana oleh sistem
                    </Typography>
                    <TitleCaptions
                        title="Open Item"
                        extraStyles={{ my: 2 }}
                    />
                    <Box
                        sx={{
                            display: "grid",
                            gap: 3
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>Sistem</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <Select
                                        onChange={(e) => setData({ ...data, system: e.target.value })}
                                        size='small'
                                        value={data.system}
                                        fullWidth
                                    >
                                        <MenuItem value="PRS">Sewaan (PRS)</MenuItem>
                                        <MenuItem value="PAS">Cukai (PAS)</MenuItem>
                                        <MenuItem value="LISO">Lesen Operasi (LIS Operating)</MenuItem>
                                        <MenuItem value="LIST">Lesen Perniagaan (LIS Trading)</MenuItem>
                                        <MenuItem value="NBL">Lesen UUK</MenuItem>
                                    </Select>
                                    {errors.system && <div className="text-red-500 mt-2 text-sm">{errors.system}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>No Akaun/No. Lesen</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField
                                        hiddenLabel
                                        value={data.account_number}
                                        onChange={(e) => setData({ ...data, account_number: e.target.value })}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.account_number && <div className="text-red-500 mt-2 text-sm">{errors.account_number}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>ID Pelanggan</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        value={data.identity_number}
                                        onChange={(e) => setData({ ...data, identity_number: e.target.value })}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.identity_number && <div className="text-red-500 mt-2 text-sm">{errors.identity_number}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>Nama Pelanggan</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        value={data.customer_name}
                                        onChange={(e) => setData({ ...data, customer_name: e.target.value })}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.customer_name && <div className="text-red-500 mt-2 text-sm">{errors.customer_name}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                    </Box>
                    <Stack sx={{ display: "flex", flexDirection: "row", gap: 2, marginY: '3rem' }}>
                        <Button variant="outlined" fullWidth onClick={handleClose}>Batal</Button>
                        <Button variant="contained" fullWidth onClick={handleSubmit} disabled={processing}>
                            Simpan
                        </Button>
                    </Stack>
                </Box>
            </Modal >
            <Box id="TerimaanTableContainer" sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Terimaan
                </Typography>
                <TitleCaptions title="Maklumat" extraStyles={{ my: 2 }} />
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(2, minmax(min(200px, 100%), 1fr))",
                        gap: 4,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {
                            auth.user.role.name !== 'cashier' ? (
                                <>
                                    <Typography sx={{ width: 120 }}>Juruwang</Typography>
                                    <Typography>:</Typography>
                                    <Select
                                        onChange={(e) => setData({ ...data, cashier_id: e.target.value })}
                                        size='small'
                                        value={data.cashier_id}
                                        fullWidth
                                    >
                                        {cashiers.map((cashier) => (
                                            <MenuItem key={cashier.id} value={cashier.id}>{cashier.name}</MenuItem>
                                        ))}
                                    </Select>
                                </>
                            ) : (
                                <>
                                    <Typography sx={{ width: 120 }}>Juruwang</Typography>
                                    <Typography>:</Typography>
                                    <TextField
                                        value={auth.user.id}
                                        variant="outlined"
                                        size="small"
                                        disabled
                                    />
                                    <TextField
                                        value={auth.user.name}
                                        variant="outlined"
                                        size="small"
                                        disabled
                                    />
                                </>
                            )
                        }

                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {
                            auth.user.role.name !== 'cashier' ? (
                                <>
                                    <Typography sx={{ width: 120 }}>Pusat Kutipan</Typography>
                                    <Typography>:</Typography>
                                    <Select
                                        onChange={(e) => {
                                            setData({ ...data, collection_center_id: e.target.value })
                                            setCounterOptions(collection_centers.find(collection_center => collection_center.id === e.target.value).counters)
                                        }}
                                        size='small'
                                        value={data.collection_center_id}
                                        fullWidth
                                    >
                                        {
                                            collection_centers.map((collection_center) => (
                                                <MenuItem key={collection_center.id} value={collection_center.id}>{collection_center.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </>
                            ) : (
                                <CustomTextField label="Pusat Kutipan" value={auth.user?.current_cashier_opened_counter?.collection_center?.name || '-'} disabled />
                            )
                        }
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120 }}>Tarikh</Typography>
                        <Typography>:</Typography>
                        <DateField
                            value={today}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                },
                            }}
                            disabled
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        {
                            auth.user.role.name !== 'cashier' ? (
                                <>
                                    <Typography sx={{ width: 120 }}>No. Kaunter</Typography>
                                    <Typography>:</Typography>
                                    <Select
                                        onChange={(e) => setData({ ...data, counter_id: e.target.value })}
                                        size='small'
                                        value={data.counter_id}
                                        fullWidth
                                    >
                                        {
                                            counterOptions.map((counter) => (
                                                <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </>
                            ) : (
                                <CustomTextField label="No. Kaunter" value={auth.user?.current_cashier_opened_counter?.counter?.name || '-'} disabled />
                            )
                        }
                    </Stack>
                    <CustomTextField label="Bilangan Bil" value={current_bill} disabled />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TitleCaptions
                        title="Butiran Bil"
                        extraStyles={{ my: 2 }}
                    />
                    <Box sx={{ overflow: "auto" }}>
                        <TableContainer
                            sx={{
                                width: "100%",
                                display: "table",
                                tableLayout: "fixed",
                            }}
                        >
                            <Table id="targetTable">
                                <TableHead sx={{ backgroundColor: "#004269" }}>
                                    <TableRow>
                                        <TableCell sx={{ color: "white" }}>
                                            Bil
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Kod Hasil
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Keterangan
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            No. Akaun
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            No. Bil
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            No. Rujukan
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Amaun
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                        >
                                            1
                                        </TableCell>
                                        <TableCell>
                                            <FormControl
                                                sx={{ m: 1, width: 200 }}
                                            >
                                                <Autocomplete
                                                    options={income_codes}
                                                    getOptionLabel={(option) => option.code + " - " + option.description}
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextField
                                                            {...params}
                                                            label="Kod Hasil"
                                                        />
                                                    )}
                                                    value={
                                                        data.transactions[0]?.income_code || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        handleChange("income_code", newValue);
                                                    }}
                                                    size="small"
                                                />
                                                <InputError
                                                    message={errors[`transactions.${0}.income_code`]}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <TextareaAutosize
                                                sx={{ m: 1, width: 200 }}
                                                label="Keterangan"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={
                                                    data.transactions[0]
                                                        ?.description || ""
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value.toUpperCase();
                                                    handleChange("description", value);
                                                }}
                                            />
                                            <InputError
                                                message={errors[`transactions.${0}.description`]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormControl
                                                sx={{ m: 1, }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Autocomplete
                                                        size="small"
                                                        sx={{ width: 200 }}
                                                        options={resultsAvailableAccount[0]}
                                                        getOptionLabel={(option) => option.account_number}
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                                label="No. Akaun"
                                                                onChange={(e) => setSearch(e.target.value)}
                                                            />
                                                        )}
                                                        onChange={(event, newValue) => {
                                                            handleChange("account_number", newValue?.account_number || "");
                                                        }}
                                                    />
                                                    <IconButton
                                                        variant="contained"
                                                        size="small"
                                                        onClick={handleOpenItem}
                                                    >
                                                        <PlusCircleIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Box>
                                                <InputError
                                                    message={errors[`transactions.${0}.account_number`]}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <FormControl
                                                sx={{ m: 1, width: 200 }}
                                            >
                                                <Autocomplete
                                                    options={availableBillOnRow[0] || []}
                                                    getOptionLabel={(option) => option.bill_number || ""}
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            label="No. Bil"
                                                        />
                                                    )}
                                                    value={
                                                        data.transactions[0]?.bill_number || null
                                                    }
                                                    onChange={(event, newValue) => {
                                                        handleChange("bill_number", newValue || []);
                                                    }}
                                                    size="small"
                                                />
                                                <InputError
                                                    message={errors[`transactions.${0}.bill_number`]}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                sx={{ m: 1, width: 200 }}
                                                label="Rujukan"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={
                                                    data.transactions[0]
                                                        ?.reference_number || ""
                                                }
                                                onChange={(e) => handleChange("reference_number", e.target.value)}
                                            />
                                            <InputError
                                                message={errors[`transactions.${0}.reference_number`]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                sx={{ m: 1, width: 100 }}
                                                label="Nilai"
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={
                                                    data.transactions[0]
                                                        ?.amount || ""
                                                }
                                                onChange={(e) =>
                                                    handleAmountChange(
                                                        0,
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors[`transactions.${0}.amount`]}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TitleCaptions
                        title="Butiran Bayaran"
                        extraStyles={{ my: 2 }}
                    />
                    <Box sx={{ overflow: "auto" }}>
                        <TableContainer
                            sx={{
                                width: "100%",
                                display: "table",
                                tableLayout: "fixed",
                            }}
                        >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: "#004269" }}>
                                    <TableRow>
                                        <TableCell sx={{ color: "white" }}>
                                            Jenis
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Amaun
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Kod Bank
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Nama Bank
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Rujukan
                                        </TableCell>
                                        <TableCell sx={{ color: "white" }}>
                                            Pembayar/Pemegang Kad
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Select
                                                label="Jenis"
                                                variant="outlined"
                                                size="small"
                                                value={data.payment[0]?.type || ""}
                                                onChange={(e) =>
                                                    handleRowBayaranChange(
                                                        "0",
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {
                                                    payment_types.map((type) => (
                                                        <MenuItem key={type.id} value={type.id}>{type.code}-{type.description}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Amaun"
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    data.payment[0]
                                                        ?.amount || ""
                                                }
                                                onChange={(e) =>
                                                    handleAmountPaymentChange(
                                                        0,
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormControl
                                                sx={{ m: 1, width: 200 }}
                                            >
                                                <Autocomplete
                                                    options={banks}
                                                    getOptionLabel={(
                                                        option
                                                    ) =>
                                                        option.code + " - " + option.name
                                                    }
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextField
                                                            {...params}
                                                            label="Kod Bank"
                                                        />
                                                    )}
                                                    value={
                                                        banks.find(c => c.code === data.payment[0]?.code_bank) || null
                                                    }
                                                    onChange={(e, newValue) => {
                                                        handleRowBayaranChange(
                                                            0,
                                                            "code_bank",
                                                            newValue.code
                                                        )
                                                        handleRowBayaranChange(
                                                            0,
                                                            "bank_name",
                                                            newValue.name
                                                        )
                                                    }}
                                                    size="small"
                                                />
                                                <InputError
                                                    message={errors[`payment.${0}.code_bank`]}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Nama Bank"
                                                variant="outlined"
                                                size="small"
                                                value={data.payment[0]?.bank_name || ""}
                                                onChange={(e) =>
                                                    handleRowBayaranChange(
                                                        0,
                                                        "bank_name",
                                                        e.target.value
                                                    )
                                                }
                                                disabled
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Rujukan"
                                                variant="outlined"
                                                size="small"
                                                value={data.payment[0]?.reference || ""}
                                                onChange={(e) =>
                                                    handleRowBayaranChange(
                                                        0,
                                                        "reference",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                label="Pembayar/Pemegang Kad"
                                                variant="outlined"
                                                size="small"
                                                value={data.payment[0]?.card_holder_name || ""}
                                                onChange={(e) =>
                                                    handleRowBayaranChange(
                                                        0,
                                                        "card_holder_name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Box>
                    <TitleCaptions
                        title="Jumlah Akhir"
                        extraStyles={{ my: 2 }}
                    />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(min(200px, 100%), 1fr))",
                            gap: 4,
                        }}
                    >
                        <CustomTextField
                            label="Amaun Kena Bayar (RM)"
                            value={amountTotal.toFixed(2)}
                            variant="standard"
                            width={300}
                        />
                        <CustomTextField
                            label="Amaun Diterima (RM)"
                            value={amountReceived.toFixed(2)}
                            variant="standard"
                            width={300}
                        />
                        <CustomTextField
                            label="Baki Dikembalikan (RM)"
                            value={amountReturn.toFixed(2)}
                            variant="standard"
                            width={300}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 5 }}>
                    {/* <Button variant="outlined" fullWidth>
                        Batal
                    </Button> */}
                    <Button variant="contained" fullWidth onClick={handlePrint}>
                        Jana
                    </Button>
                </Box>
            </Box>
        </AuthenticatedLayout >
    );
}
