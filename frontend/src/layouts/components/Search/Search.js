import { faTasks } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import images from '~/assets/images';
import { ClearIcon, SearchIcon } from '~/components/Icons';
import Image from '~/components/Image';
import TaskList from '~/components/TaskList';
import { useDebounce } from '~/hooks';
import * as taskService from '~/services/taskService';

function Search({ id }) {
    const inputRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const userId = localStorage.getItem('userId');

    const debouncedValue = useDebounce(searchValue, 700);

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }

        (async () => {
            const { data } = await taskService.getAllTasks();
            const listTaskOfUserId = data.filter((task) => task.userId === (userId ?? id));

            setSearchResult((prev) => {
                return listTaskOfUserId.filter((task) => task.name.includes(debouncedValue.trim()));
            });
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);

        inputRef.current.focus();
    };

    const maxLength = 50;
    const truncatedSearchValue = searchValue.length > maxLength ? `${searchValue.slice(0, maxLength)}...` : searchValue;

    const renderResult = () => {
        return (
            <div className="bg-white w-[600px] shadow-[0_24px_54px_rgba(0,0,0,0.15)] rounded-[4px] p-[12px] max-sm:hidden">
                <h3 className="text-[15px] font-medium">
                    <FontAwesomeIcon className="text-[#2564cf]" icon={faTasks} /> Tìm kiếm: "{truncatedSearchValue}"
                </h3>
                {searchResult.length > 0 ? (
                    <div onClick={handleHideResult}>
                        <TaskList tasks={searchResult} setTasks={setSearchResult} />
                    </div>
                ) : (
                    <div>
                        <Image src={images.monkey} alt="Tasks not found" className="mx-auto mt-[60px]" />
                        <p className="text-center mt-[10px] font-medium">Không có tác vụ nào được tìm thấy</p>
                    </div>
                )}
            </div>
        );
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    return (
        <HeadlessTippy
            interactive
            visible={showResult}
            offset={[0, 2]}
            placement="bottom-start"
            render={renderResult}
            onClickOutside={handleHideResult}
        >
            <div className="relative flex items-center w-[600px] max-sm:hidden">
                <span className="absolute top-0 lef-0 bottom-0 flex items-center justify-center px-[8px] text-[#2564cf]">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    value={searchValue}
                    ref={inputRef}
                    spellCheck={false}
                    placeholder="Tìm kiếm..."
                    className="flex-1 py-[8px] px-[40px] h-[32px] rounded-md text-xl"
                    onChange={handleChange}
                    onFocus={() => setShowResult(true)}
                />
                {!!searchValue && (
                    <span
                        className="absolute top-0 bottom-0 right-0 flex items-center justify-center px-[8px] cursor-pointer text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                        onClick={handleClear}
                    >
                        <ClearIcon />
                    </span>
                )}
            </div>
        </HeadlessTippy>
    );
}

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
    };
};

export default connect(mapStateToProps)(Search);
