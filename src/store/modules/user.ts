import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { login, getInfo, logout} from '@/api/login';
import { IJwtUserDtoData } from '@/types/login';

export interface IUserState {
    token: string
    user: IJwtUserDtoData
    roles: string[]
    loadMenus: boolean
}

@Module({ dynamic: true, store, name: 'user' })
export default class User extends VuexModule implements IUserState {
    public token = "";
    public user: IJwtUserDtoData = {
        id: NaN, nickName: "", username: "", 
        gender: "", phone: "", roles:[], dataScopee:[]};
    public roles: string[] = [];
    public loadMenus = false;

    @Mutation
    private SET_TOKEN(token: string) {
        this.token = token;
    }

    @Mutation
    private SET_USER(user: IJwtUserDtoData) {
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
        const rememberMe = userInfo.rememberMe;
        let res = await login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid);
        setToken(res.data.token, rememberMe);
        this.SET_TOKEN(res.data.token);
        if (res.data.user.roles.length === 0) {
            this.SET_ROLES(["ROLE_SYSTEM_DEFAULT"]);
        } else {
            this.SET_ROLES(res.data.user.roles);
        }
        this.SET_USER(res.data.user);
        this.SET_LOAD_MENUS(true);
    }

    @Action
    public async GetInfo() {
        let res = await getInfo();
        if (res.data.roles.length === 0) {
            this.SET_ROLES(["ROLE_SYSTEM_DEFAULT"]);
        } else {
            this.SET_ROLES(res.data.roles);
        }
        this.SET_USER(res.data);
    }

    @Action
    public async LogOut() {
        await logout();
        this.SET_TOKEN("");
        this.SET_ROLES([]);
        removeToken();
    }

    @Action
    public async UpdateLoadMenus() {
        this.SET_LOAD_MENUS(false);
    }
}

export const UserModule = getModule(User)