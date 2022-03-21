import BackgroundService from 'react-native-background-actions';
import BackgroundJob from 'react-native-background-actions';
const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
class BService {
    constructor() {
        this.Options = {
            taskName: 'Demo',
            taskTitle: 'Demo Running',
            taskDesc: 'Demo',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            parameters: {
                delay: 5000,
            },
            actions: '["Exit"]'
        };


    }
    async VeryIntensiveTask(taskDataArguments) {
        const { delay } = taskDataArguments;
        await new Promise(async (resolve) => {
            var i = 0;
            for (let i = 0; BackgroundJob.isRunning(); i++) {
                message: "Success DOOD " + i
                // })
                await sleep(delay);
            }
        });
    }
    Start() {
        BackgroundService.start(this.VeryIntensiveTask, this.Options);
    }
    Stop() {
        BackgroundService.stop();
    }
}
const BackgroudService = new BService();
export default BackgroudService;