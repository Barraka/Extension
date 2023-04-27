const { exec } = require('child_process');
const cheerio = require('cheerio');
const fs = require('fs');

exec(`curl -L "https://www.theguardian.com/international" -A "Mozilla/5.0 (compatible;  MSIE 7.01; Windows NT 5.0)"`, (err, stdout, stderr) => {
    if(err) {
        console.error('error: ', err);
        return;
    }
});