import MenuDate from '../../date/MenuDate';
import { MealRange } from '../../enum/Meal';
import IDiningHallBase from '../../models/dining-halls/IDiningHallBase';
import IDiningHallMenu from '../../models/dining-halls/menu/IDiningHallMenu';
import IMenuSelection from '../../models/dining-halls/menu/IMenuSelection';
import IMenusForDay from '../../models/dining-halls/menu/IMenusForDay';

export default abstract class IFoodClient {
    abstract async retrieveMenu(selection: IMenuSelection): Promise<IDiningHallMenu>;

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