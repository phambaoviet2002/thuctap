import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

import _ from 'lodash';
import { useDebounce } from '~/hooks';
import * as taskService from '~/services/taskService';
import { ClearIcon } from '../Icons';

const styles = {
    boxWrapperModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'background.paper',
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: '20px 24px',
        maxWidth: '350px',
        width: '100%',
        p: 4,
        borderRadius: '8px',
    },
    btnClose: {
        position: 'absolute',
        fontSize: '1.5rem',
        padding: '8px',
        borderRadius: '50%',
        overflow: 'visible',
        color: 'rgba(0, 0, 0, 0.54)',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        top: '3px',
        right: '3px',
        minWidth: 'inherit',
    },
    boxControlBtn: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        marginTop: '10px',
    },
    boxSaveBtn: {
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgb(255, 255, 255)',
        maxWidth: '80px',
        backgroundColor: '#2564cf',
        width: '100%',
        minWidth: '0px',
        minHeight: '0px',
        textTransform: 'capitalize',
        height: '40px',
        margin: '0px 0px 0.75rem',
        boxShadow: 'rgb(43 52 69 / 10%) 0px 4px 16px',
        '&:hover': {
            backgroundColor: '#4b83e3',
            boxShadow: 'rgb(3 0 71 / 1%) 0px 0px 28px',
        },
    },
    boxCancelBtn: {
        fontSize: '14px',
        fontWeight: 600,
        maxWidth: '80px',
        border: '1px solid rgba(210, 63, 87, 0.5)',
        color: '#2564cf',
        width: '100%',
        minWidth: '0px',
        minHeight: '0px',
        textTransform: 'capitalize',
        height: '40px',
        borderColor: '#2564cf',
        '&:hover': {
            borderColor: '#0048c3',
            backgroundColor: 'rgba(37, 100, 207, 0.08)',
        },
    },
};

function AddLabelQuickView({ data, openModal, handleCloseModal }) {
    const handleClose = () => handleCloseModal();
    const [labelId, setLabelId] = useState('');
    const [searchLabelValue, setSearchLabelValue] = useState('');
    const [searchLabelResult, setSearchLabelResult] = useState([]);
    const [listLabel, setListLabel] = useState([]);

    const debouncedLabelValue = useDebounce(searchLabelValue, 700);

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchLabelValue(searchValue);
        }
    };

    useEffect(() => {
        if (!debouncedLabelValue.trim()) {
            setSearchLabelResult([]);
            return;
        }

        const newListLabel = listLabel.filter((label) => label.name.includes(debouncedLabelValue));
        setSearchLabelResult(newListLabel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedLabelValue]);

    useQuery({
        queryKey: ['getLabels', debouncedLabelValue],
        queryFn: () => axios.get('/v1/label'),
        onSuccess: ({ data: { data } }) => setListLabel(data),
    });

    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: (labelId) => taskService.updateTask({ labelId: labelId || data.labelId }, data._id),
        onSuccess: async ({ success }) => {
            if (success) {
                await queryClient.invalidateQueries({
                    queryKey: ['createTask'],
                });

                toast.success('Cập nhật nhãn thành công');
                handleClose();
            } else {
                toast.error('Cập nhật nhãn thất bại!');
            }
        },
    });

    const handleChangeLabel = (labelId) => {
        setLabelId(labelId);
    };

    const handleSave = () => {
        mutateAsync(labelId);
    };

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styles.boxWrapperModal}>
                <Grid container>
                    <Box
                        component={'h3'}
                        className="mb-[16px] w-full flex items-center justify-center text-[18px] font-medium"
                    >
                        Nhãn
                    </Box>
                    <Box component={'form'} noValidate sx={{ width: '100%' }}>
                        <Box
                            component={'input'}
                            type="text"
                            placeholder="Tìm nhãn..."
                            className="w-full px-[12px] py-[8px] border-[2px] border-solid border-[#dedee5] rounded-[3px] focus:border-[#388bff]"
                            onChange={handleChange}
                        />
                        <Box component={'p'} className="text-[14px] font-medium mt-[16px] mb-[6px]">
                            Nhãn
                        </Box>
                        {(_.size(searchLabelResult) > 0 ? searchLabelResult : listLabel).map((label) => (
                            <Box key={label._id} className="flex items-center gap-[10px]">
                                <Box
                                    component={'input'}
                                    type="radio"
                                    name="label"
                                    checked={label._id === (labelId || data.labelId)}
                                    id={label._id}
                                    className="w-5 h-5 text-indigo-600 border border-indigo-600 rounded focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onChange={(e) => handleChangeLabel(e.target.id)}
                                />
                                <Box component={'p'}>{label.name}</Box>
                            </Box>
                        ))}
                        <Box sx={styles.boxControlBtn}>
                            <Button variant="outlined" sx={styles.boxCancelBtn} onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button variant="contained" sx={styles.boxSaveBtn} onClick={handleSave}>
                                Lưu
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Button sx={styles.btnClose} onClick={handleClose}>
                    <ClearIcon />
                </Button>
            </Box>
        </Modal>
    );
}

AddLabelQuickView.propTypes = {
    data: PropTypes.object.isRequired,
    openModal: PropTypes.bool,
    handleCloseModal: PropTypes.func,
};

export default AddLabelQuickView;
