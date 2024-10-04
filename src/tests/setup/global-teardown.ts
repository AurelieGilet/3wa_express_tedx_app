import { stopDocker } from './docker-manager';

const teardown = async () => {
    await stopDocker();
    console.log('Global teardown');
};

export default teardown;
