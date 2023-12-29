import PropTypes from 'prop-types';

import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, setTasks }) {
    return (
        <div className="mt-[4px]">
            {tasks.map((task) => (
                <TaskItem key={task._id} task={task} tasks={tasks} setTasks={setTasks} />
            ))}
        </div>
    );
}

TaskList.propTypes = {
    setTasks: PropTypes.func,
    tasks: PropTypes.array.isRequired,
};

export default TaskList;
