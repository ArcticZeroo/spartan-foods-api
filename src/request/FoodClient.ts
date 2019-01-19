import * as path from 'path';
import paths from '../config/paths';
import MenuDate from '../date/MenuDate';
import { MealIdentifier, MealRange } from '../enum/Meal';
import IDiningHallBase from '../models/dining-halls/IDiningHallBase';
import IDiningHallMenu from '../models/dining-halls/menu/IDiningHallMenu';
import IMenuSelection from '../models/dining-halls/menu/IMenuSelection';
import IMenusForDay from '../models/dining-halls/menu/IMenusForDay';
import MenuParser from '../parsers/MenuParser';
import retryingRequest from './retryingRequest';

export default class FoodClient {
    private menuParser = new MenuParser();

    static getRequestUrl({ diningHall, menuDate, meal } : IMenuSelection): string {
        return encodeURI(`${path.join(paths.base, paths.menu, diningHall.fullName)}/all/${menuDate.getFormatted()}?field_mealtime_target_id=${MealIdentifier[meal]}`);
    }

    async retrieveMenu(selection: IMenuSelection): Promise<IDiningHallMenu> {
        let html: string;
        try {
            html = await retryingRequest(FoodClient.getRequestUrl(selection));
        } catch (e) {
            throw e;
        }

        return this.menuParser.parse(html);
    }

    async retrieveSingleHallMenusForDay(diningHall: IDiningHallBase, menuDate: MenuDate): Promise<IDiningHallMenu[]> {
        const promises: Array<Promise<IDiningHallMenu>> = [];

        for (let meal = MealRange.start; meal < MealRange.end; ++meal) {
            promises.push(this.retrieveMenu({ diningHall, menuDate, meal }));
        }

        return Promise.all(promises);
    }

    async retrieveAllHallMenusForDay(diningHalls: IDiningHallBase[], menuDate: MenuDate): Promise<IMenusForDay> {
        const menusForDay: IMenusForDay = {};

        const promises = [];

        for (const diningHall of diningHalls) {
            promises.push(this.retrieveSingleHallMenusForDay(diningHall, menuDate));
        }

        let menuSets: Array<IDiningHallMenu[]>;
        try {
            menuSets = await Promise.all(promises);
        } catch (e) {
            throw e;
        }

        for (let i = 0; i < menuSets.length; ++i) {
            menusForDay[diningHalls[i].searchName] = menuSets[i];
        }

        return menusForDay;
    }
}
