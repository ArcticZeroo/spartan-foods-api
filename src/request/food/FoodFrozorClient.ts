import paths from '../../config/paths';
import MenuDate from '../../date/MenuDate';
import { Meal } from '../../enum/Meal';
import IDiningHallBase from '../../models/dining-halls/IDiningHallBase';
import IDiningHallMenu from '../../models/dining-halls/menu/IDiningHallMenu';
import IMenuSelection from '../../models/dining-halls/menu/IMenuSelection';
import IMenusForDay from '../../models/dining-halls/menu/IMenusForDay';
import StringUtil from '../../util/StringUtil';
import retryingRequest from './../retryingRequest';
import IFoodClient from './IFoodClient';

export default class FoodFrozorClient extends IFoodClient {
    static getRequestUrlForEntireDay(menuDate: MenuDate): string {
        return StringUtil.joinUrl(paths.frozor.base, paths.frozor.api, paths.frozor.msu, paths.frozor.dining, paths.frozor.menu, paths.frozor.all, menuDate.getFormatted());
    }

    static getRequestUrlForSingle({ diningHall, menuDate, meal }: { diningHall: IDiningHallBase, menuDate: MenuDate, meal: Meal | 'all' }): string {
        return StringUtil.joinUrl(paths.frozor.base, paths.frozor.api, paths.frozor.msu, paths.frozor.dining, paths.frozor.menu, diningHall.searchName, menuDate.getFormatted(), meal.toString());
    }

    async retrieveMenu(selection: IMenuSelection): Promise<IDiningHallMenu> {
        let body: IDiningHallMenu;
        try {
            body = await retryingRequest(FoodFrozorClient.getRequestUrlForSingle(selection), { type: 'json' });
        } catch (e) {
            throw e;
        }

        return body;
    }

    async retrieveSingleHallMenusForDay(diningHall: IDiningHallBase, menuDate: MenuDate): Promise<IDiningHallMenu[]> {
        let body: IDiningHallMenu[];
        try {
            body = await retryingRequest(FoodFrozorClient.getRequestUrlForSingle({ diningHall, menuDate, meal: 'all' }), { type: 'json' });
        } catch (e) {
            throw e;
        }

        return body;
    }

    async retrieveAllHallMenusForDay(diningHalls: IDiningHallBase[], menuDate: MenuDate): Promise<IMenusForDay> {
        let body: IMenusForDay;
        try {
            body = await retryingRequest(FoodFrozorClient.getRequestUrlForEntireDay(menuDate), { type: 'json' });
        } catch (e) {
            throw e;
        }

        return body;
    }
}
