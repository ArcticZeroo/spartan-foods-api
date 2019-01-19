import IDiningHallMenu from '../models/dining-halls/menu/IDiningHallMenu';
import IDiningHallVenue from '../models/dining-halls/menu/IDiningHallVenue';
import IMenuItem from '../models/dining-halls/menu/IMenuItem';
import IParser from '../models/IParser';

export default class MenuParser implements IParser<IDiningHallMenu> {
    private static get nullMenu(): IDiningHallMenu {
        return { closed: true, venues: [] };
    }

    parse(html: string): IDiningHallMenu {
        const $ = cheerio.load(html);

        const mainText = $('rhs-facility-menu').text();

        if (mainText && mainText.toLowerCase().includes('closed')) {
            return MenuParser.nullMenu;
        }

        const places = $('.eas-list');

        const venues: IDiningHallVenue[] = [];

        places.each(function(index, element) {
            const $place = $(element);

            let venueName = $($place.find('.venue-title')[0]).text();
            venueName = venueName[0].toUpperCase() + venueName.substr(1).toLowerCase();

            const descriptionElems = $place.find('.venue-description > p')[0];

            const description = descriptionElems ? descriptionElems.children[0].data : undefined;

            const menuItems = $place.find('.menu-item');

            const menu: IMenuItem[] = [];

            menuItems.each(function(index, element) {
                const $menuItem = $(element);

                const name = $($menuItem.find('.meal-title')[0]).text();

                const diningPrefItems = $menuItem.find('.dining-prefs');

                const diningPrefs: string[] = [];

                diningPrefItems.each(function(index, element) {
                    const split = $(element).text().split(', ');

                    if (!split || !split.length || !split[0]) {
                        return;
                    }

                    diningPrefs.push(...split);
                });

                const allergensRaw = $($menuItem.find('.allergens')[0]).text().trim();
                let allergens: string[] = [];

                if (allergensRaw.length) {
                    const split = allergensRaw.replace(/^contains:\s+/i, '').split(', ');

                    if (split.length && split[0]) {
                        allergens = split;
                    }
                }

                menu.push({ name, preferences: diningPrefs, allergens });
            });

            venues.push({ venueName, description, menu });
        });

        return { closed: false, venues };
    }
}