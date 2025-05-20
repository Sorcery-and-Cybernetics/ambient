//*************************************************************************************************
// skiplistnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistnode", function(_) {    

    var valuecompare = function(searchvalue, matchvalue, option) {
        switch(option) {
            case "<=":
                return searchvalue <= matchvalue;
            case ">=":
                return searchvalue >= matchvalue;
            case ">":
                return searchvalue > matchvalue;
            case "<":
                return searchvalue < matchvalue;
            default: // "==" or undefined
                return searchvalue == matchvalue;
        }
    }

    _.define.linkedlistnode("skiplistnode", function (supermodel) {
        this.__upsegment = null;
        this.__topsegment = null;            
        this.__level = 1;

        this.constructbehavior = _.behavior(function() {
            this.assign = function(cursor, index) {
                supermodel.assign.call(this, cursor, index);

                //todo: For now we do a simple random level 
                if (!this.__topsegment) {
                    var level = _.math.logarithmicchance(this.list().segmentsize(), this.list().segmentlevel());

                    if (level > 1) {
                        this.__upsegment = _.model.skiplistsegment(this, level - 1);
                    } else {
                        this.__topsegment = this;
                    }
                }

                if (this.__upsegment) {  
                    this.__upsegment.link();
                }

                this.segmentleftup().calcsegment(true, true);

                return this;
            };

            this.unlink = function() {
                if (this.__upsegment) { this.__upsegment.unlink(); }
                this.__topsegment = null;
                
                var nodeprev = this.__nodeprev;
                supermodel.unlink.call(this);
                nodeprev.segmentleftup().calcsegment(false, true);
                return this;
            };

            this.destroy = function() {
                this.unlink();
                return null;
            };            
        });

        this.modelbehavior = _.behavior(function() {
            this.value = function() { 
                return this.__value; 
            };

            this.sortvalue = function(list) { 
                list = list || this.list();
                var sortvaluename = list.sortvaluename()
                if (sortvaluename) { return this.__value.get(sortvaluename); }
                return this.__value; 
            };            

            this.orderindex = function(relativenode) {
                if (this.isroot()) { return 0; }
                if (relativenode) { return this.orderindex() - relativenode.orderindex(); }

                if (this.__upsegment) { return this.__upsegment.orderindex() + 1; }
                return this.__nodeprev instanceof _.model.skiplist? 1: this.__nodeprev.orderindex() + 1;
            };           
        });

        this.navigationbehavior = _.behavior(function() {
            this.isroot = function() { return false; };
            this.base = function() { return this; };
            this.segmenttop = function() { return this.__topsegment; };
            this.level = function() { return 1; };

            this.segmentnext = function() { return this.__nodenext; };            
            this.segmentprev = function() { return this.__nodeprev; };
            this.segmentdown = function() { return null; };

            this.segmentleftup = function() {
                if (this.__upsegment) {  return this.__upsegment; }
                if (this.isroot()) { return null; }

                var cursor = this;

                while (cursor) {
                    if (cursor.__upsegment) { return cursor.__upsegment; }
                    cursor = cursor.__nodeprev;
                }
            };
            
            this.segmentrightup = function() { return this.segmentleftup().__nextsegment; };                
            this.segmentup = function() { return this.__upsegment || undefined; };
        }); 
        
        this.searchbehavior = _.behavior(function() {
            this.valueinsegment = function(searchvalue, option) {
                return valuecompare(searchvalue, this.sortvalue(), option);
            }
        });
               
        this.debugbehavior = _.behavior(function () {
            this.debugout = function() {
                var result = this.value() + ", segments ["                
                var cursor = this.segmentup();

                while (cursor) {
                    result += cursor.__childcount;
                    cursor = cursor.segmentup();
                    if (cursor) { result += ", "; }
                }
                result += "]";
                return result;
            }

            this.debugvalidate = function() {
                var errors = (this.__upsegment? this.__upsegment.debugvalidate(): undefined);

                return errors? errors: undefined;
            }
        });            
    });
})