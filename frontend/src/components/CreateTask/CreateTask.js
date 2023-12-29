import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';

import images from '~/assets/images';
import Image from '~/components/Image';
import * as taskService from '~/services/taskService';
import { CalendarIcon, InputRadioIcon, NotifyIcon, RepeatIcon } from '../Icons';
import TaskList from '../TaskList';

function CreateTask({ id, important = false, finished = false }) {
    const taskInputRef = useRef();
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState([{}]);
    const userId = localStorage.getItem('userId');

    const { isLoading } = useQuery({
        queryKey: ['createTask'],
        queryFn: () => axios.get('/v1/task'),
        onSuccess: ({ data: { data, success } }) => {
            if (success) {
                const listTaskOfUserId = data.filter((task) => {
                    return task.userId === (userId ?? id);
                });
                const listNormalTask = listTaskOfUserId.filter((task) => !task.isFinished);

                setTasks(() => {
                    if (important) {
                        const listImportantTask = listTaskOfUserId.filter(
                            (task) => task.isImportant && !task.isFinished,
                        );
                        return listImportantTask;
                    } else if (finished) {
                        const listFinishedTask = listTaskOfUserId.filter((task) => task.isFinished);
                        return listFinishedTask;
                    }

                    return listNormalTask;
                });
            }
        },
    });

    const handleTaskInputChange = (e) => {
        const taskValue = e.target.value;

        if (!taskValue.startsWith(' ')) {
            setTaskInput(taskValue);
        }
    };

    const createTask = async () => {
        if (!taskInput) return;

        const formData = {
            name: taskInput,
            isImportant: important,
            userId: userId ?? id,
        };

        try {
            const { data, success } = await taskService.createTask(formData);
            if (success) {
                setTasks([...tasks, data]);
                toast.success('Đã thêm công việc thành công!');
            } else {
                toast.error('Không thể thêm công việc. Vui lòng thử lại!');
            }

            setTaskInput('');
            taskInputRef.current.focus();
        } catch (error) {
            console.error('Lỗi khi tạo tác vụ:', error);
        }
    };

    const handleCreateTask = () => {
        createTask();
    };

    const handleEnterCreateTask = (e) => {
        if (e.which === 13) {
            createTask();
        }
    };

    return (
        <div className="mt-[26px]">
            {finished || (
                <div className="shadow-md rounded-[4px] overflow-hidden">
                    <div className="flex items-center px-[16px] bg-white">
                        <button className="ml-[6px] text-[#2564cf]">
                            <InputRadioIcon />
                        </button>
                        <input
                            type="text"
                            ref={taskInputRef}
                            value={taskInput}
                            placeholder="Thêm tác vụ"
                            className="px-[14px] py-[14px] w-full placeholder-[#2564cf]"
                            onChange={handleTaskInputChange}
                            onKeyDown={handleEnterCreateTask}
                        />
                    </div>
                    <div className="flex items-center justify-between border-t border-solid border-[#e1dfdd] px-[16px] h-[45px]">
                        <div className="flex items-center">
                            <button className="p-[4px] ml-[2px] hover:bg-white rounded-[4px] transition-colors">
                                <CalendarIcon />
                            </button>
                            <button className="p-[4px] ml-[8px] hover:bg-white rounded-[4px] transition-colors">
                                <NotifyIcon />
                            </button>
                            <button className="p-[4px] ml-[8px] hover:bg-white rounded-[4px] transition-colors">
                                <RepeatIcon />
                            </button>
                        </div>
                        <button
                            className={`px-[8px] h-[32px] border border-solid border-[#e1dfdd] text-[12px] bg-white ${
                                taskInput ? 'text-[#2564cf]' : 'text-[#a19f9d]'
                            }`}
                            onClick={handleCreateTask}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            )}
            {isLoading ? (
                <>
                    {Array(5)
                        .fill(null)
                        .map((_, key) => (
                            <Skeleton
                                key={key}
                                variant="rectangular"
                                style={{ width: '100%', marginTop: '8px', borderRadius: '4px' }}
                                height={55}
                            />
                        ))}
                </>
            ) : (
                <>
                    {_.size(tasks) > 0 ? (
                        <TaskList tasks={tasks} setTasks={setTasks} />
                    ) : (
                        <div>
                            <Image src={images.monkey} alt="Tasks not found" className="mx-auto mt-[60px]" />
                            <p className="text-center mt-[10px] font-medium">Không có tác vụ nào được tìm thấy</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

CreateTask.propTypes = {
    finished: PropTypes.bool,
    important: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
    };
};

export default connect(mapStateToProps)(CreateTask);
