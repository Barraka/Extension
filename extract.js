const { exec } = require('child_process');
const cheerio = require('cheerio');
const fs = require('fs');

const execOptions = {
    maxBuffer: 10 * 1024 * 1024, // Increase maxBuffer to 10 MB
};
const url = `curl -L "https://www.lequipe.fr/" -A "Mozilla/5.0 (compatible;  MSIE 7.01; Windows NT 5.0)"`;
exec(url, execOptions, (err, stdout, stderr) => {
    if(err) {
        console.error('error: ', err);
        return;   
    };
    const $ = cheerio.load(stdout);
    $('script, style, li').remove();
    const textArray = [];
    $('body *').each((index, element) => {
        const elText = $(element).text().trim().replace(/\s\s+/g, ' ');
        if (elText && !textArray.includes(elText)) {
            textArray.push(elText);
            prevText = elText;
        }
    });
    const rawText = textArray.join('\n');
    const text = rawText.replace(/\n{2,}/g, '\n');
    // const text = textArray.join('\n');
    const filePath = 'extract.txt';
    fs.writeFile(filePath, text, e=> {
        if(e)console.error('Error: ', e);
    });
});