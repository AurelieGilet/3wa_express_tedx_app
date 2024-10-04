import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from 'testcontainers';
import path from 'path';

let instance: StartedDockerComposeEnvironment | null = null;

export const startDocker = async () => {
    const composeFilePath = path.resolve(__dirname);
    const composeFile = 'docker-composer.yml';

    instance = await new DockerComposeEnvironment(composeFilePath, composeFile).up();
    console.log('✅ Docker composer instance is running');
};

export const stopDocker = async () => {
    if (!instance) {
        return;
    }

    try {
        await instance.down();
        instance = null;
    } catch (error) {
        console.log(`❌Error stopping Docker: ${error}`);
    }
};

export const getDockerInstance = () => {
    if (!instance) {
        throw new Error('❌Docker instance is not running');
    }

    return instance;
};
