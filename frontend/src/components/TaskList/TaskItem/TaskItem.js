import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';
import { toast } from 'react-hot-toast';

import EditTaskQuickView from '~/components/EditTaskQuickView';
import {
    CalendarIcon,
    CheckIcon,
    CheckSolidIcon,
    InputRadioIcon,
    StarIcon,
    StarSolidIcon,
    TrashIcon,
} from '~/components/Icons';
import * as taskService from '~/services/taskService';
import './tasksedit.css';

function TaskItem({ task, tasks, setTasks }) {
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const handleCloseModal = () => setOpenModalEdit(false);

    const [taskIdToDelete, setTaskIdToDelete] = useState(null);

    const handleDelete = async (id) => {
        setTaskIdToDelete(id);
    };

    const confirmDelete = async () => {
        if (taskIdToDelete) {
            const data = await taskService.deleteTask(taskIdToDelete);
            if (data.success) {
                toast.success('Xóa công việc thành công');
            } else {
                toast.error('Xóa công việc thất bại!');
            }

            const tasksAfterDelete = tasks.filter((task) => task._id !== taskIdToDelete);
            setTasks(tasksAfterDelete);
        }

        setTaskIdToDelete(null);
    };

    const cancelDelete = () => {
        setTaskIdToDelete(null);
    };

    const queryClient = useQueryClient();

    const toggleMoveToImportant = useMutation({
        mutationFn: ({ isImportant, id }) => taskService.updateTask({ isImportant }, id),
        onSuccess: async ({ data, success }) => {
            if (success) {
                await queryClient.invalidateQueries({
                    queryKey: ['createTask'],
                });

                toast.success(
                    data.isImportant ? 'Đã chuyển công việc vào mục quan trọng' : 'Đã gỡ công việc khỏi mục quan trọng',
                );
            }
        },
    });

    const toggleMoveToFinished = useMutation({
        mutationFn: ({ isFinished, id }) => taskService.updateTask({ isFinished }, id),
        onSuccess: async ({ data, success }) => {
            if (success) {
                await queryClient.invalidateQueries({
                    queryKey: ['createTask'],
                });

                toast.success(
                    data.isFinished ? 'Đã chuyển công việc vào mục hoàn thành' : 'Đã gỡ công việc khỏi mục hoàn thành',
                );
            }
        },
    });

    const handleMoveToImportant = (id) => {
        toggleMoveToImportant.mutateAsync({
            isImportant: true,
            id,
        });
    };

    const handleRemoveToImportant = (id) => {
        toggleMoveToImportant.mutateAsync({
            isImportant: false,
            id,
        });
    };

    const handleMoveToFinished = (id) => {
        toggleMoveToFinished.mutateAsync({
            isFinished: true,
            id,
        });
    };

    const handleRemoveToFinished = (id) => {
        toggleMoveToFinished.mutateAsync({
            isFinished: false,
            id,
        });
    };

    function removeNonBreakingSpaces(str) {
        return str?.replace(/&nbsp;/g, ' ');
    }

    const { data: label = {} } = useQuery({
        queryKey: ['getLabelById', task.labelId],
        queryFn: () => axios.get(`/v1/label/${task.labelId}`),
        enabled: !!task.labelId,
        select: ({ data: { data } }) => data,
    });

    return (
        <div>
            <ContextMenuTrigger id={task._id}>
                <div className="flex items-center shadow-sm px-[16px] mt-[8px] bg-white rounded-[4px] hover:bg-[#f5f5f5] cursor-pointer">
                    <button
                        className="p-[6px] text-[#2564cf]"
                        onClick={() =>
                            task.isFinished ? handleRemoveToFinished(task._id) : handleMoveToFinished(task._id)
                        }
                    >
                        {task.isFinished ? <CheckSolidIcon /> : <InputRadioIcon />}
                    </button>
                    <div className="px-[14px] py-[8px] w-full" onClick={() => setOpenModalEdit(true)}>
                        <p
                            className={`text-[14px] outline-none fixtask outline-offset-0 focus:outline-[#2564cf] ${
                                task.isFinished ? 'line-through' : 'no-underline'
                            }`}
                        >
                            {removeNonBreakingSpaces(task.name)}
                        </p>
                        <p className="text-[12px] text-[#605e5c]">{label.name || 'Tác vụ'}</p>
                    </div>
                    <span
                        className="text-[#2564cf] px-[4px] py-[2px]"
                        onClick={() =>
                            task.isImportant ? handleRemoveToImportant(task._id) : handleMoveToImportant(task._id)
                        }
                    >
                        {task.isImportant ? <StarSolidIcon /> : <StarIcon />}
                    </span>
                </div>
                <EditTaskQuickView data={task} openModal={openModalEdit} handleCloseModal={handleCloseModal} />
            </ContextMenuTrigger>

            <ContextMenu id={task._id}>
                <div className="py-[6px] rounded-[4px] bg-white shadow-[rgba(0,0,0,0.133)_0px_3.2px_7.2px_0px]">
                    <ul>
                        <li
                            className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer"
                            onClick={() =>
                                task.isImportant ? handleRemoveToImportant(task._id) : handleMoveToImportant(task._id)
                            }
                        >
                            <span className="mx-[4px]">
                                <StarIcon />
                            </span>
                            <span className="mx-[4px] px-[4px] text-[14px]">
                                {task.isImportant ? 'Loại bỏ mức độ quan trọng' : 'Đánhh dấu là quan trọng'}
                            </span>
                        </li>
                        <li className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer">
                            <span className="mx-[4px]">
                                <CheckIcon />
                            </span>
                            <span
                                className="mx-[4px] px-[4px] text-[14px]"
                                onClick={() =>
                                    task.isFinished ? handleRemoveToFinished(task._id) : handleMoveToFinished(task._id)
                                }
                            >
                                {task.isFinished ? 'Đánh dấu là chưa hoàn thành' : 'Đánhh dấu là đã hoàn thành'}
                            </span>
                        </li>
                        <li className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer">
                            <span className="mx-[4px]">
                                <CalendarIcon />
                            </span>
                            <span className="mx-[4px] px-[4px] text-[14px]">Đặt thời hạn cho công việc này</span>
                        </li>
                        <li className="my-[6px] border-b border-solid border-[#e1dfdd] bg-[#e1dfdd]"></li>
                        <li
                            className="flex items-center px-[12px] h-[36px] text-[#a80000] hover:bg-[#f5f5f5] cursor-pointer"
                            onClick={() => handleDelete(task._id)}
                        >
                            <span className="mx-[4px]">
                                <TrashIcon />
                            </span>
                            <span className="mx-[4px] px-[4px] text-[14px]">Xóa tác vụ</span>
                        </li>
                    </ul>
                </div>
            </ContextMenu>

            {/* Modal Delele */}
            {taskIdToDelete === task._id && (
                <div>
                    <div className="overlay"></div>
                    <div className="confirmation-dialog">
                        <p className="confirm-h1">Bạn có chắc chắn muốn xóa?</p>

                        <div className="btn-container">
                            <p className="confirm-p">Xóa nhiệm vụ này!</p>

                            <button onClick={cancelDelete} className="cancel-btn">
                                Hủy
                            </button>
                            <button onClick={confirmDelete} className="confirm-btn">
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

TaskItem.propTypes = {
    task: PropTypes.object.isRequired,
    setTasks: PropTypes.func,
    tasks: PropTypes.array.isRequired,
};

export default TaskItem;
