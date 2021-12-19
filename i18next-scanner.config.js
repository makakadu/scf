const fs = require('fs')
const path = require('path')
const typescript = require("typescript")
const chalk = require('chalk');

module.exports = {
    input: [
        'src/**/*.{js,jsx,ts,tsx}', // Ищет файлы во всём каталоге src с такими расширениями 
    ],
    output: './',
    options: {
        debug: true,
        func: {
            list: ['i18n.t', 't'], // Я в основном использую t(), так что можно удалить 'i18n.t'
            //extensions: ['.js', '.jsx', '.ts', '.tsx'], // хз зачем повторяться
        },
		sort: true,
        lngs: ['fr', 'ru', 'uk', 'de'], // сканер будет искать каталоги с этими названиями в locales, поэтому нужно указать все языки
        ns: [
            'translation',
        ],
        defaultLng: 'en',
        defaultNs: 'translation',
        defaultValue: '__NOT_TRANSLATED__',
        resource: {
            loadPath: 'public/locales/{{lng}}/{{ns}}.json',
            savePath: 'public/locales/{{lng}}/{{ns}}.json',
            jsonIndent: 4,
            lineEnding: '\n'
        },
        nsSeparator: false, // namespace separator
        keySeparator: '.', // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        },
        removeUnusedKeys: true, // удалить из файлов с переводами неиспользуемые в коде ключи. Чтобы не удалялись используемые ключи нужно передавать в t() значения, а не переменные
    },

    transform: function customTransform(file, enc, done) {
        "use strict";
        
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        let count = 0;

        let parse = (key, options) => {
            parser.set(key, Object.assign({}, options, {
                nsSeparator: false,
                keySeparator: false
            }));
            ++count;
        }
				
        parser.parseFuncFromString(content, { list: ['t'] }, parse);

        if (count > 0) {
            console.log(`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`); // подсчёт ключей в каждом файле, где есть минимум один ключ
        }
        done();
    }
};
