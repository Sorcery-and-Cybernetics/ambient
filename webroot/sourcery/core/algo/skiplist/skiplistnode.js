//*************************************************************************************************
// skiplistnode - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistnode", function(_) {    
    _.define.core.linkedlistnode("core.skiplistnode", function (supermodel) {
        this.__upsegment = null;
        this.__topsegment = null;            
        this.__level = 1;

        this.objectbehavior = _.behavior(function() {
            this.construct = function(value) {
                this._value = value;
            };

            this.destroy = function () {
                this.unlink();
                return null;
            };
        });

        this.skiplistnavigationbehavior = _.behavior(function() {
            this.isroot = function () { return false; };
            this.base = function () { return this; };
            this.segmenttop = function () { return this.__topsegment; };

            this.segmentnext = function () {
                return this.__nextnode;
            };
            
            this.segmentprev = function () { 
                return this.__prevnode;
            };

            this.segmentdown = function () { 
                return null;
            };

            this.segmentleftup = function() {
                if (this.__upsegment) {  return this.__upsegment; }
                if (this.isroot()) { return null; }

                var cursor = this;

                while (cursor) {
                    if (cursor.__upsegment) { return cursor.__upsegment; }
                    cursor = cursor.__prevnode;
                }
            };
            
            this.segmentrightup = function() {
                return this.segmentleftup().__nextsegment;
            };                

            this.segmentup = function () { 
                return this.__upsegment || undefined;
            };
        });            

        this.skiplistbehavior = _.behavior(function() {
            this.assign = function(cursor, index) {
                supermodel.assign.call(this, cursor, index);

                //todo: For now we do a simple random level 
                if (!this.__topsegment) {
                    var level = _.math.logarithmicchance(this.list().segmentsize(), this.list().segmentlevel());

                    if (level > 1) {
                        this.__upsegment = _.make.core.skiplistsegment(this, level - 1);
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
                this.__topsegment = null;
                if (this.__upsegment) { this.__upsegment.unlink(); }
                
                var prevnode = this.__prevnode;
                supermodel.unlink.call(this);
                prevnode.segmentleftup().calcsegment(false, true);
            };

            this.orderindex = function(relativenode) {
                if (this.isroot()) { return 0; }
                if (relativenode) { return this.orderindex() - relativenode.orderindex(); }

                if (this.__upsegment) { return this.__upsegment.orderindex() + 1; }
                return this.__prevnode instanceof _.make.core.skiplist? 1: this.__prevnode.orderindex() + 1;
            };
        });
        
        this.debugbehavior = _.behavior(function () {
            this.debugout = function() {}
            this.debugvalidate = function() {
                var errors = (this.__segmentup? this.__segmentup.debugvalidate(): []);

                return errors.length? errors: undefined;
            }
        });            
    });
})