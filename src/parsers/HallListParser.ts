import paths from '../config/paths';
import IDiningHallBase from '../models/dining-halls/IDiningHallBase';
import IParser from '../models/IParser';

const NAME_FROM_URL = new RegExp(`^${paths.menu}(.+?)/all`);

export default class HallListParser implements IParser<IDiningHallBase[]> {
    parse(html: string): IDiningHallBase[] {
        const $ = cheerio.load(html);

        const nameSquares = $('.dining-menu-name');
        const diningHalls: IDiningHallBase[] = [];

        nameSquares.each(function(index, element) {
            // @ts-ignore
            const $nameSquare = $(element);

            // Get the only a tag in this square, which would link to the menu,
            // and get its href for the url
            const url = decodeURI($nameSquare.find('a').attr('href'));

            //console.log('URL: ' + url);

            // If the URL doesn't start with the dining hall URL, it's another kind of page
            // such as starbucks, food truck, etc.
            if (!url.toLowerCase().includes(paths.menu)) {
                return;
            }

            // If the full name cannot be obtained from the URL, something is horribly wrong about
            // this dining hall.
            if (!NAME_FROM_URL.test(url)) {
                return;
            }

            const match = url.match(NAME_FROM_URL);

            if (!match) {
                return;
            }

            // The first match in this will be the full name (see regexp)
            const fullName = match[1];

            //console.log(`This dining hall's name is ${fullName}`);

            // The first match from this class find will be the one we want,
            // so get the data contained in its first child (which is a div
            // tag, apparently)
            const hallName = $($nameSquare.find('.dining-hall-name')[0]).text();
            const brandName = $($nameSquare.find('.brand-name')[0]).text();

            diningHalls.push({
                hallName, brandName, fullName,
                searchName: hallName.toLowerCase().replace('hall', '').trim()
            });
        });

        return diningHalls;
    }
}