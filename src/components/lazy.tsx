import { lazy } from 'react';

// Lazy load main components
export const Dashboard = lazy(() => import('./Dashboard'));
export const SeniorProfile = lazy(() => import('./SeniorProfile'));
export const CareAdvisor = lazy(() => import('./CareAdvisor'));
export const LandingPage = lazy(() => import('./LandingPage'));
export const AddSeniorModal = lazy(() => import('./AddSeniorModal'));
export const AilmentInfoModal = lazy(() => import('./AilmentInfoModal'));

// Lazy load particle effects (heavier components)
export const FloatingParticles = lazy(() => import('./FloatingParticles'));
export const ParticleBurst = lazy(() => import('./ParticleBurst'));
