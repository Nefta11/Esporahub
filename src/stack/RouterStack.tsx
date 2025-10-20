import { Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import LandingPage from '@/pages/landing/LandingPage';
import ProtectedRoute from '@/components/generals/ProtectedRoute';
import LoginPage from '@/pages/auth/LoginPage';
import MenuPage from '@/pages/menu/MenuPage';
import OverviewMainPage from '@/pages/overview/OverviewMainPage';
import AccountSettings from '@/pages/overview/overviewAccounts/AccountSettings';
import CollaborationAgreementPage from '@/pages/overview/clientDashboard/CollaborationAgreementPage';
import ConstructionPage from '@/pages/ConstructionPage';
import EHOPage from '@/pages/overview/clientDashboard/EHOPage';
import SelectAccountPage from '@/pages/overview/overviewAccounts/SelectAccountPage';
import ClientDashboardPage from '@/pages/overview/clientDashboard/ClientDashboardPage';
import ActiveAccountsPage from '@/pages/overview/overviewAccounts/ActiveAccountsPage';
import InactiveAccountsPage from '@/pages/overview/overviewAccounts/InactiveAccountsPage';
import ExpedienteElectronicoPage from '@/pages/overview/clientDashboard/ExpedienteElectronicoPage';
import PresentacionInicialPage from '@/pages/overview/clientDashboard/PresentacionInicialPage';
import WorkHubPage from '@/pages/worhub/WorkHubPage';
import EsporaReportBuilderPage from '@/pages/esporaReportBuilder/EsporaReportBuilderPage';
import ReportConfigurationPage from '@/pages/esporaReportBuilder/ReportConfigurationPage';

const RouterStack = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                timeout={{ enter: 600, exit: 300 }}
                classNames={{
                    enter: 'page-enter',
                    enterActive: 'page-enter-active',
                    exit: 'page-exit',
                    exitActive: 'page-exit-active'
                }}
                mountOnEnter
                unmountOnExit
            >
                <Routes location={location}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={
                        <ProtectedRoute requireAuth={false}>
                            <LoginPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <MenuPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/overview-menu" element={
                        <ProtectedRoute>
                            <OverviewMainPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/configuracion-cuenta" element={
                        <ProtectedRoute requiredPermissions={["create_accounts", "edit_accounts"]}>
                            <AccountSettings />
                        </ProtectedRoute>
                    } />
                    <Route path="/seleccionar-cuenta" element={
                        <ProtectedRoute>
                            <SelectAccountPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/cliente-dashboard" element={
                        <ProtectedRoute>
                            <ClientDashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/cuentas-activas" element={
                        <ProtectedRoute>
                            <ActiveAccountsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/cuentas-inactivas" element={
                        <ProtectedRoute>
                            <InactiveAccountsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/acuerdo-colaboracion" element={
                        <ProtectedRoute>
                            <CollaborationAgreementPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/construction" element={
                        <ProtectedRoute>
                            <ConstructionPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/expediente-electronico" element={
                        <ProtectedRoute>
                            <ExpedienteElectronicoPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/presentacion-inicial" element={
                        <ProtectedRoute>
                            <PresentacionInicialPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/eho" element={
                        <ProtectedRoute>
                            <EHOPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/workhub" element={
                        <ProtectedRoute>
                            <WorkHubPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/espora-report-builder" element={
                        <ProtectedRoute>
                            <EsporaReportBuilderPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/seleccionar-tipo-contenido" element={
                        <ProtectedRoute>
                            <ReportConfigurationPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default RouterStack;
