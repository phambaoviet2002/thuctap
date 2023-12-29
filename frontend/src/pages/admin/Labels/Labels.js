import { faBell, faCalendar, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faArrowsRotate, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

import { TagsIcon } from '~/components/Icons';
import Modal from '~/components/Modal';
import { deleteById, get, post, update } from '~/utils/httpRequest';

const ButtonCustom = ({ type = 'submit', onClick, children, className, variant }) => {
    const variants =
        variant === 'outlined'
            ? 'border-2 border-gray-500 hover:text-white'
            : variant === 'contained'
            ? 'text-white hover:text-black'
            : '';
    return (
        <button
            onClick={onClick}
            type={type}
            className={`px-10 py-5 rounded-lg transition-all font-semibold text-[2rem] ${className} ${variants}`}
        >
            {children}
        </button>
    );
};

function Labels() {
    const schema = Yup.object({
        label: Yup.string().required().min(3).max(20),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [labelData, setLabelData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const createLabel = async (data) => {
        const { label } = data;
        try {
            setIsLoading(true);
            const res = await post('/label', {
                name: label,
            });
            if (res) {
                setLabelData(res);
                reset();
                toast.success('Create label successfully');
            }
        } catch (error) {
            toast.error('Create label failed!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wrapper wrapper-container">
            <h2 className="text-gray-400 font-semibold text-[3rem] mb-4">Labels</h2>
            <div>
                <form onSubmit={handleSubmit(createLabel)}>
                    <div className="flex items-center h-24 px-3 text-white bg-gray-400 rounded-lg">
                        <TagsIcon className="text-[2rem]" />
                        <input
                            {...register('label')}
                            className="w-full bg-transparent  pl-5 placeholder:text-white text-[2rem]"
                            name="label"
                            type="text"
                            placeholder="Add label"
                        />
                    </div>
                    {errors.label && <p className="text-red-500">{errors.label.message}</p>}
                    <div className="flex justify-between mt-6">
                        <div className="flex items-center gap-10">
                            <FontAwesomeIcon className="text-[2rem]" icon={faCalendar} />
                            <FontAwesomeIcon className="text-[2rem]" icon={faBell} />
                            <FontAwesomeIcon className="text-[2rem]" icon={faArrowsRotate} />
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            className="px-6 py-4 text-white transition-all bg-blue-400 rounded-lg hover:bg-transparent"
                        >
                            {isLoading ? <FontAwesomeIcon className="animate-spin" icon={faSpinner} /> : 'Create label'}
                        </Button>
                    </div>
                </form>
            </div>
            <div className="mt-10">
                <ListLabel dependence={labelData} isLoading={isLoading} setIsLoading={setIsLoading} />
            </div>
        </div>
    );
}

const ListLabel = ({ dependence, isLoading, setIsLoading }) => {
    const [openModal, setOpenModal] = useState(false);
    const [ListLabel, setListLabel] = useState([]);
    const [editLabel, setEditLabel] = useState({});
    const [ChoseModal, setChoseModal] = useState(true);

    const schema = Yup.object({
        label: Yup.string().required().min(3).max(20),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const getLabel = async () => {
        try {
            setIsLoading(true);
            const res = await get('label');
            if (res) {
                setListLabel(res?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getEditLabel = async (id) => {
        try {
            const res = await get(`label/${id}`);
            if (res) {
                setEditLabel(res?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const pushUpdateLabel = async ({ label }) => {
        try {
            setIsLoading(true);
            await update(`label?id=${editLabel?._id}`, {
                name: label,
            });
            reset();
            setOpenModal(false);
            toast.success('Update label successfully');
            getLabel();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteThis = async (id) => {
        try {
            setIsLoading(true);
            const res = await deleteById(`label?id=${id}`);
            if (res) {
                setOpenModal(false);
                toast.success('Delete label successfully');
                getLabel();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getLabel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependence]);

    return (
        <>
            {isLoading ? (
                <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    <Modal
                        isOpen={openModal}
                        onRequestClose={() => setOpenModal(false)}
                        contentLabel={
                            ChoseModal
                                ? 'Edit label'
                                : `Do you want to delete ${openModal ? ` "${editLabel?.name}" ` : ''}`
                        }
                    >
                        {ChoseModal ? (
                            <>
                                <form
                                    className="flex flex-col items-center gap-10 p-10"
                                    onSubmit={handleSubmit(pushUpdateLabel)}
                                >
                                    <div className="overflow-hidden border-2 rounded-xl">
                                        <input
                                            {...register('label')}
                                            name="label"
                                            className="w-full px-4 py-5"
                                            placeholder={openModal ? editLabel?.name : ''}
                                            type="text"
                                        />
                                    </div>
                                    {errors.label && <p className="text-red-500">{errors.label.message}</p>}
                                    <Button variant="contained" type="submit" size="large" className="bg-blue-400">
                                        {isLoading ? (
                                            <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                                        ) : (
                                            'Submit'
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-center gap-10 my-5">
                                    <ButtonCustom
                                        variant={'outlined'}
                                        className="hover:bg-blue-400"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Cancel
                                    </ButtonCustom>
                                    <ButtonCustom
                                        onClick={() => deleteThis(openModal ? editLabel?._id : '')}
                                        variant={'contained'}
                                        className="bg-red-500 hover:text-white hover:bg-opacity-80"
                                    >
                                        Delete
                                    </ButtonCustom>
                                </div>
                            </>
                        )}
                    </Modal>
                    {ListLabel.map((items, key) => (
                        <div className="h-[200px] w-[200px]" key={key}>
                            <div className="flex items-center justify-center border-4 border-b-0 border-gray-400 rounded-t-lg h-2/3">
                                <Typography variant="h4">{items.name}</Typography>
                            </div>
                            <div className="flex items-center justify-center gap-6 border-4 border-gray-400 rounded-t-lg rounded-b-lg h-1/3">
                                <button
                                    onClick={() => {
                                        getEditLabel(items._id);
                                        setOpenModal(true);
                                        setChoseModal(true);
                                    }}
                                    className="transition-colors hover:text-blue-400"
                                >
                                    <FontAwesomeIcon className="text-[2rem]" icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => {
                                        getEditLabel(items._id);
                                        setOpenModal(true);
                                        setChoseModal(false);
                                    }}
                                    className="transition-colors hover:text-rose-400"
                                >
                                    <FontAwesomeIcon className="text-[2rem]" icon={faTrashAlt} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

ListLabel.propTypes = {
    dependence: PropTypes.object,
    isLoading: PropTypes.bool,
};

ButtonCustom.propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    variant: PropTypes.string,
};

export default Labels;
