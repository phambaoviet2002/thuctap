import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AddLabelQuickView from '~/components/AddLabelQuickView';
import * as taskService from '~/services/taskService';
import ErrorMessage from '../ErrorMessage';
import { CalendarIcon, ClearIcon, DescIcon, TagsIcon, WatchIcon } from '../Icons';

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
        maxWidth: '900px',
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
    boxReviewBtn: {
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgb(255, 255, 255)',
        maxWidth: '120px',
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
    boxCancelReview: {
        fontSize: '14px',
        fontWeight: 600,
        maxWidth: '120px',
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

function EditTaskQuickView({ data, openModal, handleCloseModal }) {
    const [descValue, setDescValue] = useState('');
    const [taskName, setTaskName] = useState('');
    const [isError, setIsError] = useState({ message: '' });
    const [openModalAddLabel, setOpenModalAddLabel] = useState(false);
    const handleClose = () => handleCloseModal();

    const [isSelectDate, setIsSelectDate] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [selectedDate, setSelectedDate] = useState(() => {
        const savedDate = localStorage.getItem(`selectedDate_${data._id}`);
        return savedDate ? new Date(savedDate) : null;
    });
    const [notificationCount, setNotificationCount] = useState(0);
    const [isTaskDeleted, setIsTaskDeleted] = useState(false);

    const handleDateChange = (taskId, date) => {
        setIsTaskDeleted(false);
        setSelectedDates((prevDates) => ({
            ...prevDates,
            [taskId]: date,
        }));
    };

    function showNotification(title, options) {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, options);
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        new Notification(title, options);
                    }
                });
            }
        }
    }

    setInterval(() => {
        if (!isTaskDeleted) {
            const currentTime = new Date();
            const taskTime = selectedDates[data._id];

            const oneHour = 60 * 60 * 1000;
            if (taskTime - currentTime <= oneHour) {
                if (notificationCount < 3) {
                    showNotification('Công việc sắp đến hạn', {
                        body: `Công việc "${taskName || data.name}" sắp đến hạn trong 1 giờ.`,
                    });
                    setNotificationCount(notificationCount + 1);
                }
            }
        }
    }, 60000);

    const queryClient = useQueryClient();

    const updateTaskDesc = useMutation({
        mutationFn: ({ taskId, name, description, date }) =>
            taskService.updateTask({ name, description, date }, taskId),
        onSuccess: async ({ success }) => {
            if (success) {
                await queryClient.invalidateQueries({
                    queryKey: ['createTask'],
                });

                toast.success('Cập nhật công việc thành công');
                handleClose();
            } else {
                toast.error('Cập nhật công việc thất bại!');
            }
        },
    });

    const handleSubmitEdit = (taskId) => {
        const updatedDate = selectedDate || data.date;

        if (isError.message === '') {
            if (updatedDate?.toISOString() !== data.date) {
                updateTaskDesc.mutateAsync({
                    taskId,
                    name: taskName || data.name,
                    description: descValue || data.descValue,
                    date: updatedDate,
                });
            } else {
                updateTaskDesc.mutateAsync({
                    taskId,
                    name: taskName || data.name,
                    description: descValue || data.descValue,
                });
            }

            setNotificationCount(0);
        } else {
            toast.error(isError.message);
        }
    };

    useEffect(() => {
        if (selectedDates[data._id]) {
            localStorage.setItem(`selectedDate_${data._id}`, selectedDates[data._id].toISOString());
            localStorage.setItem(`taskName_${data._id}`, taskName);
            localStorage.setItem(`descValue_${data._id}`, descValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDates[data._id], taskName, descValue]);

    useEffect(() => {
        const savedDate = localStorage.getItem(`selectedDate_${data._id}`);
        const savedTaskName = localStorage.getItem(`taskName_${data._id}`);
        const savedDescValue = localStorage.getItem(`descValue_${data._id}`);

        if (savedDate) {
            setSelectedDates((prevDates) => ({
                ...prevDates,
                [data._id]: new Date(savedDate),
            }));
        }

        if (savedTaskName) {
            setTaskName(savedTaskName);
        }

        if (savedDescValue) {
            setDescValue(savedDescValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reactQuillRef = useRef();

    const checkCharacterCount = (event) => {
        const unprivilegedEditor = reactQuillRef.current.unprivilegedEditor;
        if (unprivilegedEditor.getLength() > 500 && event.key !== 'Backspace') {
            setIsError({ message: 'Không mô tả được quá 500 ký tự!' });
            event.preventDefault();
        } else {
            setIsError({ message: '' });
        }
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
                        style={{
                            marginBottom: '40px',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <CalendarIcon width="2.6rem" height="2.6rem" />
                        <input
                            type="text"
                            value={taskName || data.name}
                            className={`text-[18px] w-full font-medium outline-none outline-offset-0 focus:outline-[#2564cf] ${
                                data.isFinished ? 'line-through' : 'no-underline'
                            }`}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </Box>
                    <Box component={'form'} noValidate sx={{ width: '100%' }}>
                        <Box className="flex gap-[10px] mb-[10px]">
                            <DescIcon className="mt-[2px]" />
                            <Box component={'h3'} className="text-[18px] font-medium">
                                Mô tả
                            </Box>
                        </Box>
                        <Box className="flex gap-[10px]">
                            <ReactQuill
                                onKeyDown={checkCharacterCount}
                                ref={reactQuillRef}
                                placeholder="😀 Mô tả cho công việc này..."
                                theme="snow"
                                value={descValue || data.description}
                                onChange={setDescValue}
                                className="flex-1 max-w-[656px] whitespace-pre-line"
                            />
                            <Box className="w-[168px] ">
                                <Box component={'ul'}>
                                    <Box
                                        component={'li'}
                                        className="flex items-center transition-all gap-[8px] bg-[#091e420f] px-[10px] py-[6px] rounded-[5px] hover:bg-[#091e4224] cursor-pointer"
                                        onClick={() => setOpenModalAddLabel(true)}
                                    >
                                        <TagsIcon />
                                        Nhãn
                                    </Box>
                                    <AddLabelQuickView
                                        data={data}
                                        openModal={openModalAddLabel}
                                        handleCloseModal={() => setOpenModalAddLabel(false)}
                                    />
                                    <Box
                                        component={'li'}
                                        className="mt-[8px] flex items-start flex-col transition-all gap-[8px] bg-[#091e420f] px-[10px] py-[6px] rounded-[5px] hover:bg-[#091e4224] cursor-pointer"
                                    >
                                        <Box
                                            component={'span'}
                                            className="flex items-center gap-[8px] w-full"
                                            onClick={() => setIsSelectDate(!isSelectDate)}
                                        >
                                            <WatchIcon />
                                            Ngày
                                        </Box>
                                        {isSelectDate && (
                                            <DatePicker
                                                className="w-[148px] text-center bg-[#333] text-white rounded-[4px]"
                                                selected={selectedDates[data._id]}
                                                onChange={(date) => handleDateChange(data._id, date)}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="MMM d, h:mm aa"
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <ErrorMessage name={isError} />
                        <Box sx={styles.boxControlBtn}>
                            <Button variant="outlined" sx={styles.boxCancelReview} onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                sx={styles.boxReviewBtn}
                                onClick={() => handleSubmitEdit(data._id)}
                            >
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

EditTaskQuickView.propTypes = {
    data: PropTypes.object.isRequired,
    openModal: PropTypes.bool,
    handleCloseModal: PropTypes.func,
};

export default EditTaskQuickView;
