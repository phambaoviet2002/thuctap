import config from '~/config';

// Layouts
import { DashboardLayout, HeaderOnly } from '~/layouts';

// Pages
import Labels from '~/pages/admin/Labels';
import Users from '~/pages/admin/Users';
import AssignedToMe from '~/pages/client/AssignedToMe';
import Finished from '~/pages/client/Finished';
import Home from '~/pages/client/Home';
import Important from '~/pages/client/Important';
import Inbox from '~/pages/client/Inbox';
import Login from '~/pages/client/Login';
import MyDay from '~/pages/client/MyDay';
import Planned from '~/pages/client/Planned';
import Register from '~/pages/client/Register';
import Search from '~/pages/client/Search';
import Settings from '~/pages/client/Settings';
import ForgotPassword from '~/pages/client/ForgotPassword/ForgotPassword';
import ResetPassword from '~/pages/client/ForgotPassword/ResetPassword';
import Profile from '~/pages/client/Profile/Profile';
import Statistical from '~/pages/client/Statistical';

// Public routes
const publicRoutes = [
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.register, component: Register, layout: null },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: null },
    { path: config.routes.resetPassword, component: ResetPassword, layout: null },
];

// Private routes
const privateRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.myday, component: MyDay },
    { path: config.routes.planned, component: Planned },
    { path: config.routes.finished, component: Finished },
    { path: config.routes.important, component: Important },
    { path: config.routes.search, component: Search },
    { path: config.routes.assignedToMe, component: AssignedToMe },
    { path: config.routes.inbox, component: Inbox },
    { path: config.routes.settings, component: Settings, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.statistical, component: Statistical },
];

// Admin routes
const dashboardRoutes = [
    { path: config.routes.users, component: Users, layout: DashboardLayout },
    { path: config.routes.labels, component: Labels, layout: DashboardLayout },
];

export { dashboardRoutes, privateRoutes, publicRoutes };
