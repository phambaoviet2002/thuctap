import { useEffect, useMemo, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';

import * as taskService from '~/services/taskService';
import React from 'react';

function Statistical({ id }) {
    const userId = localStorage.getItem('userId');

    const [tasks, setTasks] = useState([
        { taskLabel: 'Task không quan trọng', key: 'nonImportantTasks', count: 0 },
        { taskLabel: 'Task quan trọng', key: 'importantTasks', count: 0 },
        { taskLabel: 'Task đã hoàn thành', key: 'completedTasks', count: 0 },
    ]);

    const dataChart = useMemo(() => {
        return {
            labels: tasks.map((task) => task.taskLabel),
            datasets: [
                {
                    label: 'Tasks',
                    data: tasks.map((task) => task.count),
                },
            ],
        };
    }, [tasks]);

    useEffect(() => {
        (async () => {
            const { data } = await taskService.getAllTasks();
            const listTaskOfUserId = data.filter((task) => {
                return task.userId === (userId ?? id);
            });

            const importantTasks = listTaskOfUserId.filter((task) => task.isImportant && !task.isFinished);
            const finishedTasks = listTaskOfUserId.filter((task) => task.isFinished);
            const nonImportantTasks = listTaskOfUserId.filter((task) => !task.isFinished && !task.isImportant);

            setTasks((prev) =>
                prev.map((task) => {
                    if (task.key === 'importantTasks') {
                        return { ...task, count: importantTasks.length };
                    }
                    if (task.key === 'completedTasks') {
                        return { ...task, count: finishedTasks.length };
                    }
                    return { ...task, count: nonImportantTasks.length };
                }),
            );
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <div>
                <h3 className="text-center font-semibold text-[20px] mb-[10px]">Biểu đồ cột</h3>
                <Bar data={dataChart} />
            </div>
            <div className="mt-[20px]">
                <h3 className="text-center font-semibold text-[20px] mb-[20px]">Biểu đồ đường</h3>
                <Line data={dataChart} />
            </div>
            <div className="w-[50%] mt-[20px] mx-auto">
                <h3 className="text-center font-semibold text-[20px] mb-[20px]">Biểu đồ tròn</h3>
                <Pie data={dataChart} />
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
    };
};

export default connect(mapStateToProps)(Statistical);
