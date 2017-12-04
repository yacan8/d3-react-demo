import express from 'express';
import path from 'path';
import assets from './assets.json';
const app = express();
app.use(express.static(path.resolve(__dirname, '..', 'dll-dev')));
function renderView(conf) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>d3-react-demo</title>
      <meta charset="utf-8>
      <meta http-equiv="content-type" content="text/html;charset=utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="app"></div>
      <script src="/vendor.js"></script>
      <script src="${conf['demo'].js}"></script>
    </body>
  </html>
  `;
}

app.get('/', (req, res) => {
  res.send(renderView(assets));
});

app.listen(3000, () => {
  console.log(`The server is running at http://localhost:3000/`);
});
