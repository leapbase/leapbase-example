'use strict';
var debug = require('debug')('example');
var util = require('util');
var tool = require('leaptool');

module.exports = function(app) {

  var module_name = 'example';
  app.eventEmitter.emit('extension::init', module_name);
  
  var block = tool.object(require('base')(app, module_name));
  block.role = 'user';
  block.description ='example module',
  block.tags = ['example'];
  block.depends = [];
  
  block.data = tool.object(require('basedata')(app, module_name));
  block.page = tool.object(require('basepage')(app, module_name, block.data));

  block.model = {
    name: { type: 'string' },
    type: { type: 'string' },
    content: { type: 'text' },
    note: {
      type: 'object',
      subtype: {
        type: 'json'
      }
    },
    photo: {
      type: 'file'
    },
    images: {
      type: 'array',
      subtype: {
        type: 'file'
      }
    },
    status: {
      type: 'string',
      values: [
        { display:'Active', value:'active', default:true },
        { display:'Inactive', value:'inactive' }
      ]
    },
    create_by: { type: 'string', config:{ auto:true } },
    create_date: { type: 'date', config:{ auto:true } },
    edit_by: { type: 'string', config:{ auto:true } },
    edit_date: { type: 'date', config:{ auto:true } }
  };

  block.option = {
    edit_fields: ['name', 'type'],
    list_fields: ['name', 'type'],
    search_fields: ['name', 'type']
  };

  block.test = function() {
    return 'example test';
  };
  
  // page
  block.page.index = function(req, res) {
    var page = app.getPage(req, { title:'example' });
    res.render('example/index', { page:page });
  };
  
  block.page.test = function(req, res) {
    var callback = arguments[3] || null;
    var parameter = tool.getReqParameter(req);
    debug('example test parameter:', parameter);
    var data = { value:block.test() };
    app.sendJsonData(req, res, data);
  };
  
  // page route
  app.server.get('/example', block.page.index);
  app.server.get('/example/test', block.page.test);

  return block;
};
