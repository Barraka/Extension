const output = document.querySelector('#output');
    const input = document.querySelector('#input');
    const check = document.querySelector('#check');
    const play = document.querySelector('#play');
    // const div = document.querySelector('div');
    // div.style.backgroundColor = 'red';
    const newElement = document.createElement('div');
    newElement.style.backgroundColor = 'red';
    newElement.style.height = '100px';
    newElement.style.width = '100px';
    document.body.appendChild(newElement);
    alert('new div');
    
    if(play)play.addEventListener('click', ()=> {
        const target = window.location.href;
        runlink(target);
    });
    
    if(check)check.addEventListener('click', ()=> {
        const target = input.value;
        runlink(target);
    });
    
    
    async function runlink(l) {
        
        const raw = fetch("https://extension-idbk.onrender.com", {
            method: "POST",
            body: {
                link: l
            },
        });
        const data = await raw.json();
        output.innerHTML=data;
    }

    const raw = fetch("https://extension-idbk.onrender.com", {
        method: "POST",
        body: {
            link: l
        },
    });
    const data = await raw.json();
    output.innerHTML=data;