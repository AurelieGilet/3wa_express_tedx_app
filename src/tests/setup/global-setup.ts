import { startDocker } from './docker-manager';

const setup = async () => {
    await startDocker();
    console.log('Global setup');
};

export default setup;
