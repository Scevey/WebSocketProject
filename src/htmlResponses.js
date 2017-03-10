const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const drawerPage = fs.readFileSync(`${__dirname}/../client/drawer.html`);
const chooserPage = fs.readFileSync(`${__dirname}/../client/chooser.html`);
const viewerPage = fs.readFileSync(`${__dirname}/../client/viewer.html`);
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};
const getDrawerPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(drawerPage);
  response.end();
};
const getChooserPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(chooserPage);
  response.end();
};
const getViewerPage = (request, response) =>{
	response.writeHead(200, { 'Content-Type': 'text/html'});
	response.write(viewerPage);
	response.end();
};
module.exports.getIndex = getIndex;
module.exports.getDrawer = getDrawerPage;
module.exports.getChooser = getChooserPage;
module.exports.getViewer = getViewerPage;