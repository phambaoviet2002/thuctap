import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import axios from 'axios';
import classNames from 'classnames/bind';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { connect, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import {
    BarsIcon,
    CheckIcon,
    HomeIcon,
    SearchIcon,
    SignOutIcon,
    StarIcon,
    TheSunIcon,
    WatchIcon,
} from '~/components/Icons';
import config from '~/config';
import { createAxios } from '~/createInstance';
import { handleSignOut } from '~/firebaseConfig';
import { logOut } from '~/redux/apiRequest';
import { logOutSuccess } from '~/redux/authSlice';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const sidebarList = [
    {
        id: 1,
        icon: HomeIcon,
        to: config.routes.home,
        title: 'Trang chủ',
    },
    {
        id: 2,
        icon: TheSunIcon,
        to: config.routes.myday,
        title: 'Ngày của tôi',
    },
    {
        id: 3,
        icon: StarIcon,
        to: config.routes.important,
        title: 'Quan trọng',
    },
    {
        id: 4,
        icon: CheckIcon,
        to: config.routes.finished,
        title: 'Tác vụ đã hoàn thành',
    },
    {
        id: 5,
        icon: WatchIcon,
        to: config.routes.statistical,
        title: 'Thống kê',
    },
    {
        id: 6,
        icon: SignOutIcon,
        title: 'Đăng xuất',
    },
];

function Sidebar({ currentUser, showSidebar, handleToggleSidebar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const id = currentUser?._id;
    const accessToken = currentUser?.accessToken;
    const axiosJWT = createAxios(currentUser, dispatch, logOutSuccess);

    const [searchCityValue, setSearchCityValue] = useState('');
    const [weatherInfo, setWeatherInfo] = useState({
        cityName: '--',
        weatherState: '--',
        weatherIcon: '',
        temperature: '--',
        sunrise: '--',
        sunset: '--',
        humidity: '--',
        windSpeed: '--',
    });

    const handleCityValueChange = (e) => {
        setSearchCityValue(e.target.value);
    };

    const handleSearchWeather = async (e) => {
        if (e.which === 13) {
            const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: searchCityValue,
                    appid: process.env.REACT_APP_WEATHER_ID,
                    units: 'metric',
                    lang: 'vi',
                },
            });
            setWeatherInfo({
                cityName: data.name,
                weatherState: data.weather[0].description,
                weatherIcon: data.weather[0].icon,
                temperature: Math.round(data.main.temp),
                sunrise: moment.unix(data.sys.sunrise).format('H:mm'),
                sunset: moment.unix(data.sys.sunset).format('H:mm'),
                humidity: data.main.humidity,
                windSpeed: (data.wind.speed * 3.6).toFixed(2),
            });
        }
    };

    const { mutate } = useMutation({
        mutationFn: () => logOut(dispatch, id, navigate, accessToken, axiosJWT),
        onSuccess: (data) => {
            if (data.status === 200) {
                toast.success('Đăng xuất thành công');
            } else {
                toast.error('Đăng xuất không thành công!');
            }
        },
    });

    const handleLogout = async () => {
        if (currentUser) {
            // Normal logout
            mutate();
        } else {
            handleSignOut(); // Logout google
        }
    };

    const renderWeatherResult = () => {
        return (
            <div className={cx('container')}>
                <div className={cx('main-section')}>
                    <div className={cx('search-bar')}>
                        <span>
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            value={searchCityValue}
                            name="search-city"
                            className={cx('search-input')}
                            placeholder="Tìm kiếm thành phố..."
                            onChange={handleCityValueChange}
                            onKeyDown={handleSearchWeather}
                        />
                    </div>
                    <div className={cx('info-wrapper')}>
                        <p className={cx('city-name')}>{weatherInfo.cityName}</p>
                        <p className={cx('weather-state')}>{weatherInfo.weatherState}</p>
                        {weatherInfo.weatherIcon && (
                            <img
                                src={`http://openweathermap.org/img/wn/${weatherInfo.weatherIcon}@2x.png`}
                                alt="Weather icon"
                                className={cx('weather-icon')}
                            />
                        )}
                        <p className={cx('temperature')}>{weatherInfo.temperature}</p>
                    </div>
                </div>
                <div className={cx('additional-section')}>
                    <div className={cx('row')}>
                        <div className={cx('item')}>
                            <div className={cx('label')}>MT Mọc</div>
                            <div className={cx('value', 'sunrise')}>{weatherInfo.sunrise}</div>
                        </div>
                        <div className={cx('item')}>
                            <div className={cx('label')}>MT Lặn</div>
                            <div className={cx('value', 'sunset')}>{weatherInfo.sunset}</div>
                        </div>
                    </div>
                    <div className={cx('row')}>
                        <div className={cx('item')}>
                            <div className={cx('label')}>Độ ẩm</div>
                            <div className={cx('value')}>
                                <span className={cx('humidity')}>{weatherInfo.humidity}</span>%
                            </div>
                        </div>
                        <div className={cx('item')}>
                            <div className={cx('label')}>Gió</div>
                            <div className={cx('value')}>
                                <span className={cx('wind-speed')}>{weatherInfo.windSpeed}</span> km/h
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <aside
                className={`relative w-[290px] min-h-screen border-solid border-r-[1px] border-[rgba(0,0,0,0.1)] ${
                    showSidebar ? 'block' : 'hidden'
                } max-sm:hidden`}
            >
                <div className="mt-[16px] px-[24px] h-[48px] flex items-center">
                    <button onClick={handleToggleSidebar}>
                        <BarsIcon />
                    </button>
                </div>
                <ul>
                    {sidebarList.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li key={item.id} className="relative hover:bg-[#f5f5f5] transition-colors">
                                {item.to ? (
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            cx('flex', 'items-center', 'text-2xl', 'px-[24px]', 'py-[12px]', {
                                                active: isActive,
                                            })
                                        }
                                    >
                                        <Icon />
                                        <span className="ml-[16px]">{item.title}</span>
                                    </NavLink>
                                ) : (
                                    <button
                                        className="flex items-center text-2xl px-[24px] py-[12px] w-full"
                                        onClick={handleLogout}
                                    >
                                        <Icon />
                                        <span className="ml-[16px]">{item.title}</span>
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <HeadlessTippy
                    trigger="click"
                    interactive
                    offset={[0, 4]}
                    placement="right-start"
                    render={renderWeatherResult}
                >
                    <button className="absolute bottom-[100px] right-[20px] flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[linear-gradient(145deg,#2193b0,#6dd5ed)] transition-colors">
                        <FontAwesomeIcon icon={faCloud} className="text-white" />
                    </button>
                </HeadlessTippy>
            </aside>

            <aside className="fixed bg-white bottom-0 right-0 left-0 sm:hidden border-t border-solid border-[#f5f5f5]">
                <ul className="flex">
                    {sidebarList.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li key={item.id} className="flex-1 relative hover:bg-[#f5f5f5] transition-colors">
                                {item.to ? (
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            cx(
                                                'flex',
                                                'items-center',
                                                'justify-center',
                                                'text-2xl',
                                                'px-[24px]',
                                                'py-[14px]',
                                                {
                                                    mobileActive: isActive,
                                                },
                                            )
                                        }
                                    >
                                        <Icon />
                                    </NavLink>
                                ) : (
                                    <button
                                        className="flex items-center justify-center text-2xl px-[24px] py-[14px] w-full"
                                        onClick={handleLogout}
                                    >
                                        <Icon />
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </>
    );
}

Sidebar.propTypes = {
    handleToggleSidebar: PropTypes.func,
    showSidebar: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.login.currentUser,
    };
};

export default connect(mapStateToProps)(Sidebar);
