import IDiningHallMenu from '../dining-halls/menu/IDiningHallMenu';
import IMenuSelection from '../dining-halls/menu/IMenuSelection';

export default abstract class IFoodClient {
    abstract retrieveMenu(selection: IMenuSelection): Promise<IDiningHallMenu>;
}