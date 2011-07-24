var id = document.getElementById('hello-world');
id.innerHTML = id.innerHTML.replace(/\$sub/g, Math.floor(Math.random() * 9999999));