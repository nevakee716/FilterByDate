/* Copyright (c) 2012-2013 Casewise Systems Ltd (UK) - All rights reserved */
/*global cwAPI, jQuery*/

(function(cwApi, $) {
    'use strict';

    var cwFilterByDate = function(options, viewSchema) {
        var error;

        if(true || options.CustomOptions.hasOwnProperty('replace-layout') && options.CustomOptions.hasOwnProperty('dateScriptname')) {
            this.replaceLayout = "cwLayoutList";
            cwApi.extend(this, cwApi.cwLayouts[this.replaceLayout], options, viewSchema);
            cwApi.registerLayoutForJSActions(this);
            this.viewSchema = viewSchema; 
            this.dateScriptname = options.CustomOptions['dateScriptname'];
            this.CreateOtherOptions(this.options.CustomOptions['other-options']);
        } else {
            error = 'Cannot find replace-layout';
            cwAPI.Log.Error(error);   
            return error;         
        }
    };


    cwFilterByDate.prototype.CreateOtherOptions = function(options) {
        if(options) {
            var optionList = options.split("#");
            var optionSplit;

            for (var i = 0; i < optionList.length; i += 1) {
                if(optionList[i] !== "") {
                    var optionSplit = optionList[i].split(":");
                    if(optionSplit[0] && optionSplit[1] && optionSplit[2] && optionSplit[2] === '1') {
                        if(optionSplit[1] === "true") {
                            this.options.CustomOptions[optionSplit[0]] = true;  
                        } else if(optionSplit[1] === "false") {
                            this.options.CustomOptions[optionSplit[0]] = false; 
                        }
                    }
                    else if(optionSplit[0] && optionSplit[1]  && optionSplit[2] === '0') {
                        this.options.CustomOptions[optionSplit[0]] = optionSplit[1];
                    }
                }
            }
        }
    };


    // obligatoire appeler par le system
    cwFilterByDate.prototype.drawAssociations = function (output, associationTitleText, object) {
        this.FindRangeDate(object);
        this.noneFilterObject = object;
        output.push('<div id="cwFilterByDate" class="cwTimeSelector"><input type="text" id="datepickerBegin"><input type="text" id="datepickerEnd">');
        output.push('<button type="button">Filter</button>');
        output.push('</div>');
        output.push('<div id="cwLayoutContainerWrapper">');
        this.associationTitleText = associationTitleText;
        if(cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations) {
            cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations.call(this,output, associationTitleText, object);
        } else {
            cwApi.cwLayouts.CwLayout.prototype.drawAssociations.call(this,output, associationTitleText, object);
        }
        output.push('</div>');
    };

    cwFilterByDate.prototype.FindRangeDate = function(child) {
        var nextChild = null;
        var date;
        for (var associationNode in child.associations) {
            if (child.associations.hasOwnProperty(associationNode)) {
                for (var i = 0; i < child.associations[associationNode].length; i += 1) {
                    var nextChild = child.associations[associationNode][i];
                    if(nextChild.hasOwnProperty("associations") && nextChild.associations) {
                        this.FindRangeDate(nextChild);
                    }
                    if(nextChild.properties.hasOwnProperty(this.dateScriptname)){
                        date = Date.parse(nextChild.properties[this.dateScriptname]);
                        if(this.minDate) {this.minDate = Math.min(this.minDate,date);}
                        else {this.minDate = date;}
                        if(this.maxDate) {this.maxDate = Math.max(this.maxDate,date);}
                        else {this.maxDate = date;}                                 
                    }
                }
            }
        }
    };


    

    cwFilterByDate.prototype.applyJavaScript = function () {
        var that = this;
        var libToLoad = [];

        if(cwAPI.isDebugMode() === true) {
            that.createDatePicker();
        } else {
            libToLoad = ['modules/bootstrap/bootstrap.min.js','modules/bootstrap-select/bootstrap-select.min.js'];
            // AsyncLoad
            cwApi.customLibs.aSyncLayoutLoader.loadUrls(libToLoad,function(error){
                if(error === null) {
                    that.createDatePicker();                
                } else {
                    cwAPI.Log.Error(error);
                }
            });
        }



    };
      

    cwFilterByDate.prototype.createDatePicker = function () {     
        $('.cwTimeSelector input').datepicker({ minDate: (this.minDate - Date.now()) / 3600 / 24 / 1000, maxDate: (this.maxDate - Date.now()) / 3600 / 24 / 1000});
        var TimeSelector = document.getElementById("cwFilterByDate");
        var button = TimeSelector.lastChild; 


        if(button) {
            button.addEventListener("click",this.FilterObjectAndDraw.bind(this));
        }
    };


    cwFilterByDate.prototype.FilterObjectAndDraw = function() {

        //on duplique le l objet json afin de toujours avoir une copie de l'original
        var filterObject = $.extend(true, {}, this.noneFilterObject);
        var container = document.getElementById("cwLayoutContainerWrapper");

        if(this.getDates()) {
            this.FilterObject(filterObject);
            var output = [];
            var associationTitleText = this.associationTitleText;
            var i,j;
            var accordion = $('div[class*="accordion-header"]');
            var actives = [];

            //store deploy accordeon
            for (i = 0; i < accordion.length; i += 1) {
                if(accordion[i].className.indexOf("active") !== -1) {
                    if(accordion[i] && accordion[i].children && accordion[i].children[2] && accordion[i].children[2].href) {
                        actives[i] = accordion[i].children[2].href;
                    }
                }
            }

            //build inner html
            if(cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations) {
                cwApi.cwLayouts[this.replaceLayout].prototype.drawAssociations.call(this,output, associationTitleText, filterObject);
            } else {
                cwApi.cwLayouts.CwLayout.prototype.drawAssociations.call(this,output, associationTitleText, filterObject);
            }
            container.innerHTML = output.join('');

            //enable behaviours
            cwAPI.cwDisplayManager.enableBehaviours(this.viewSchema,filterObject,false);


            //deploy stored accordeon (match are made on the href)
            accordion = $('div[class*="accordion-header"]');
            for (i = 0; i < accordion.length; i += 1) {
                if(accordion[i] && accordion[i].click && accordion[i].children && accordion[i].children[2] && accordion[i].children[2].href) {
                    for (j = 0; j < actives.length; j += 1) {
                        if(actives[j] === accordion[i].children[2].href) {
                            accordion[i].click();
                        }
                    }
                }
            }
        }
    };




    cwFilterByDate.prototype.FilterObject = function(child) {
        var nextChild = null;
        var date;
        var nodeToDelete;

        for (var associationNode in child.associations) {
            if (child.associations.hasOwnProperty(associationNode)) {
                nodeToDelete = [];
                for (var i = 0; i < child.associations[associationNode].length; i += 1) {
                    var nextChild = child.associations[associationNode][i];
                    if(nextChild.properties.hasOwnProperty(this.dateScriptname)){
                        if(Date.parse(nextChild.properties[this.dateScriptname]) < this.beginDate || Date.parse(nextChild.properties[this.dateScriptname]) > this.endDate) {
                            nodeToDelete.push(i);
                        }      
                    }
                    if(nextChild.hasOwnProperty("associations") && nextChild.associations) {
                        this.FilterObject(nextChild);
                    }
                }

                for (i = nodeToDelete.length-1; i >= 0; i -= 1) {
                    delete child.associations[associationNode].splice(nodeToDelete[i], 1);
                }
            }
        }
    };

   cwFilterByDate.prototype.getDates = function() {  
        var begin = document.getElementById("datepickerBegin");
        if(begin && begin.value) {
            this.beginDate = Date.parse(begin.value);
        } else {
            this.beginDate = null;
            this.endDate = null;
            cwApi.notificationManager.addNotification("Veuillez remplir la date de début",'error');
            return false;
        }
        var end = document.getElementById("datepickerEnd");
        if(end && end.value) {
            this.endDate = Date.parse(end.value);
        } else {
            this.endDate = null; 
            cwApi.notificationManager.addNotification("Veuillez remplir la date de fin",'error');
            return false;
        }
        return true;
    };

    cwApi.cwLayouts.cwFilterByDate = cwFilterByDate;

    }(cwAPI, jQuery));