import path from 'path';
import paths from '../../config/paths';
import { MealIdentifier } from '../../enum/Meal';
import IDiningHallMenu from '../../models/dining-halls/menu/IDiningHallMenu';
import IMenuSelection from '../../models/dining-halls/menu/IMenuSelection';
import MenuParser from '../../parsers/MenuParser';
import retryingRequest from './../retryingRequest';
import IFoodClient from './IFoodClient';

export default class FoodParserClient extends IFoodClient {
    private menuParser = new MenuParser();

    static getRequestUrl({ diningHall, menuDate, meal } : IMenuSelection): string {
        return encodeURI(`${path.join(paths.eatAtState.base, paths.eatAtState.menu, diningHall.fullName)}/all/${menuDate.getFormatted()}?field_mealtime_target_id=${MealIdentifier[meal]}`);
    }

    async retrieveMenu(selection: IMenuSelection): Promise<IDiningHallMenu> {
        let html: string;
        try {
            html = await retryingRequest(FoodParserClient.getRequestUrl(selection));
        } catch (e) {
            throw e;
        }

        return this.menuParser.parse(html);
    }
}
