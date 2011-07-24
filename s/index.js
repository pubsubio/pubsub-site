var id = document.getElementsByTagName('pre')[0];

id.innerHTML = id.innerHTML.replace(/\$sub/g, Math.floor(Math.random() * 9999999));