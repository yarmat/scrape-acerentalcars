const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


(async () => {
    const browser = await puppeteer.launch(
        {devtools: true}
    );
    const page = await browser.newPage();

    await page.setViewport({
        width: 1424,
        height: 768
    });

    await page.goto('https://www.acerentalcars.co.nz', {waitUntil: 'networkidle2'});

    await page.select('#cmbAge', '18');
    await page.select('select[name=formPickupLocation]', 'nz-ACA60-North');
    await page.select('select[name=formDropoffLocation]', 'nz-ACG90-South');
    // await page.$eval('input[name=formPickupDate]', el => el.value = '16, Apr, 2019');
    // await page.select('select[name=formPickupTime]', '00:00:00');
    // await page.$eval('input[name=formDropoffDate]', el => el.value = '20, Apr, 2019');
    // await page.select('select[name=formDropoffTime]', '00:00:00');

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
    });
    // page.click(".l-hero__booking-action__submit--btn").then(response => {
    //     console.log(response);
    // });

    await page.$eval('button.l-hero__booking-action__submit--btn', el => el.click());

    await page.waitForNavigation();

    const html = await page.content();

    const $ = cheerio.load(html);

    $('.l-cars__cards .c-vehicle-card').each((i, item) => {
        const name = $(item).find('.c-vehicle-card__title.notranslate').text();
        const description = $(item).find('.c-vehicle-card__subtitle').text();
        console.log(name, description);
    });

    await page.screenshot({path: 'example.png'});

    await browser.close();
})();