import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import './user.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const currentUser = useSelector((state) => state.auth.login.currentUser);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`/v1/user/`, {
                    headers: { token: `Bearer ${currentUser.accessToken}` },
                });
                setUsers(data.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUsers();
    }, [users.length, currentUser.accessToken]);

    const handleDelete = (userId) => {
        setUserIdToDelete(userId);
    };

    const confirmDelete = async () => {
        try {
            const { data } = await axios.delete(`/v1/user/${userIdToDelete}`, {
                headers: {
                    token: `Bearer ${currentUser.accessToken}`,
                },
            });

            if (data.success) {
                const updatedUsers = users.filter((user) => user._id !== userIdToDelete);
                setUsers(updatedUsers);
                toast.success('This user has been removed');
                setUserIdToDelete(null);
            } else {
                toast.error('Error while deleting this user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const cancelDelete = () => {
        setUserIdToDelete(null);
    };

    return (
        <div className="wrapper">
            <h2>Users</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <React.Fragment key={user._id}>
                            <tr>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className={`delete-btn ${
                                            currentUser._id === user._id ? 'delete-btn-disabled' : ''
                                        }`}
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            {userIdToDelete === user._id && (
                                <div>
                                    <div className="overlay"></div>
                                    <div className="confirmation-dialog">
                                        <p className="confirm-h1">Are you sure you want to delete?</p>

                                        <div className="btn-container">
                                            <p className="confirm-p">Delete this user!</p>

                                            <button onClick={cancelDelete} className="cancel-btn">
                                                Cancel
                                            </button>
                                            <button onClick={confirmDelete} className="confirm-btn">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
