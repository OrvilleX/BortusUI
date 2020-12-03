import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import Cookies from 'js-cookie'

export interface IAppState {
    sidebar: {
        opened: boolean
        withoutAnimation: boolean
    }
    device: string
    size: string
}

@Module({ dynamic: true, store, name: 'app' })
export default class App extends VuexModule implements IAppState {
    public sidebar = {
        opened: Cookies.get("sidebarStatus") ? !!Cookies.get("sidebarStatus") : true,
        withoutAnimation: false
    }
    public device = "desktop"
    public size = Cookies.get('size') || 'small'

    @Mutation
    private TOGGLE_SIDEBAR() {
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.withoutAnimation = false;
        if (this.sidebar.opened) {
            Cookies.set("sidebarStatus", "1");
        } else {
            Cookies.set("sidebarStatus", "0");
        }
    }

    @Mutation
    private CLOSE_SIDEBAR(withoutAnimation: boolean) {
        Cookies.set("sidebarStatus", "0");
        this.sidebar.opened = false;
        this.sidebar.withoutAnimation = withoutAnimation;
    }

    @Mutation
    private TOGGLE_DEVICE(device: string) {
        this.device = device;
    }

    @Mutation
    private SET_SIZE(size: string) {
        this.size = size;
        Cookies.set("size", size);
    }

    @Action
    public toggleSideBar() {
        this.TOGGLE_SIDEBAR();
    }

    @Action
    public closeSideBar(withoutAnimation: boolean) {
        this.CLOSE_SIDEBAR(withoutAnimation);
    }

    @Action
    public toggleDevice(device: string) {
        this.TOGGLE_DEVICE(device);
    }

    @Action
    public setSize(size: string) {
        this.SET_SIZE(size);
    }
}

export const AppModule = getModule(App)