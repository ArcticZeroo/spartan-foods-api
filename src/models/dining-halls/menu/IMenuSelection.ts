import MenuDate from '../../../date/MenuDate';
import { Meal } from '../../../enum/Meal';
import IDiningHallBase from '../IDiningHallBase';

export default interface IMenuSelection {
    diningHall: IDiningHallBase,
    menuDate: MenuDate,
    meal: Meal // from MealIdentifier
}