import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {getToken, setToken, removeToken} from '@/utils/auth';

export interface IUserState {
    token: string
    user: string
    roles: string[]
    loadMenus: boolean
}

@Module({ dynamic: true, store, name: 'user' })
export default class User extends VuexModule implements IUserState {
    public token = "";
    public user = "";
    public roles: string[] = [];
    public loadMenus = false;

    @Mutation
    private SET_TOKEN(token: string) {
        this.token = token;
    }

    @Mutation
    private SET_USER(user: string) {
        this.user = user;
    }

    @Mutation
    private SET_ROLES(roles: string[]) {
        this.roles = roles;
    }

    @Mutation
    private SET_LOAD_MENUS(loadMenu: boolean) {
        this.loadMenus = loadMenu;
    }

    @Action
    public async Login(userInfo: {rememberMe: boolean, username: string, password: string, code: string, uuid: string}) {

    }

    @Action
    public async GetInfo() {

    }

    @Action
    public async LogOut() {

    }

    @Action
    public async UpdateLoadMenus() {
        
    }
}

export const UserModule = getModule(User)